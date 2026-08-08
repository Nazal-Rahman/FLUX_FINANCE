import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  TRANSACTIONS: 'flux_transactions',
  WEEKLY_REPORTS: 'flux_weekly_reports',
  USER_PROFILE: 'flux_user_profile',
  COIN_VAULT: 'flux_coin_vault'
};

// Initialize default profile if not exists
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify({
      name: 'User',
      appStartDate: new Date().toISOString(),
      isDarkMode: true
    }));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEEKLY_REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_REPORTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COIN_VAULT)) {
    localStorage.setItem(STORAGE_KEYS.COIN_VAULT, JSON.stringify({ '1': 0, '2': 0, '5': 0, '10': 0, '20': 0 }));
  }
};

initStorage();

export const LocalDB = {
  // --- Transactions ---
  getTransactions: () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || []; }
    catch { return []; }
  },
  
  addTransaction: (amount, type, category, note = '', module = 'general') => {
    const txs = LocalDB.getTransactions();
    const newTx = {
      id: uuidv4(),
      amount: parseFloat(amount),
      type, // 'income' or 'expense'
      category,
      note,
      module,
      date: new Date().toISOString()
    };
    txs.push(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    return newTx;
  },

  deleteTransaction: (id) => {
    let txs = LocalDB.getTransactions();
    txs = txs.filter(tx => tx.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  },

  // --- Reports (Sunday Logic) ---
  getWeeklyReports: () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEEKLY_REPORTS)) || []; }
    catch { return []; }
  },
  
  generateSundayReport: () => {
    const now = new Date();
    // Get the most recent Sunday
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - now.getDay());
    lastSunday.setHours(23, 59, 59, 999);

    const weekId = `Week Ending ${lastSunday.toLocaleDateString()}`;
    const reports = LocalDB.getWeeklyReports();
    
    // If we already generated a report for this past week, skip
    if (reports.find(r => r.id === weekId)) return;

    // Calculate the week (Monday to Sunday)
    const txs = LocalDB.getTransactions();
    const startOfMonday = new Date(lastSunday);
    startOfMonday.setDate(lastSunday.getDate() - 6);
    startOfMonday.setHours(0,0,0,0);

    const thisWeekTxs = txs.filter(tx => new Date(tx.date) >= startOfMonday && new Date(tx.date) <= lastSunday);
    
    let totalGain = 0;
    let totalLoss = 0;
    
    thisWeekTxs.forEach(tx => {
      if (tx.type === 'income') totalGain += tx.amount;
      else totalLoss += tx.amount;
    });

    reports.push({
      id: weekId,
      totalGain,
      totalLoss,
      generationDate: now.toISOString()
    });

    localStorage.setItem(STORAGE_KEYS.WEEKLY_REPORTS, JSON.stringify(reports));
  },

  // --- Profile ---
  getProfile: () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE)); }
    catch { return null; }
  },
  updateProfile: (updates) => {
    const profile = { ...LocalDB.getProfile(), ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // --- Vault ---
  getVault: () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.COIN_VAULT)) || {}; }
    catch { return {}; }
  },
  updateVault: (denomination, countDelta) => {
    const vault = LocalDB.getVault();
    vault[denomination] = Math.max(0, (vault[denomination] || 0) + countDelta);
    localStorage.setItem(STORAGE_KEYS.COIN_VAULT, JSON.stringify(vault));
  }
};
