import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState({ allTimeIncome: 0, thisWeekIncome: 0 });
  const [categoryData, setCategoryData] = useState([]);

  const PIE_COLORS = ['#F43F5E', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#14B8A6', '#6366F1'];

  useEffect(() => {
    const txs = LocalDB.getTransactions();

    // Dynamically calculate weekly reports (Monday to Sunday)
    const weeklyMap = {};
    txs.forEach(tx => {
      const d = new Date(tx.date);
      const sunday = new Date(d);
      sunday.setDate(d.getDate() + ((7 - d.getDay()) % 7));
      sunday.setHours(23, 59, 59, 999);
      
      const weekId = `Week Ending ${sunday.toLocaleDateString()}`;
      if (!weeklyMap[weekId]) {
        weeklyMap[weekId] = {
          id: weekId,
          totalGain: 0,
          totalLoss: 0,
          generationDate: sunday.toISOString() // for sorting
        };
      }
      
      if (tx.type === 'income') weeklyMap[weekId].totalGain += tx.amount;
      else weeklyMap[weekId].totalLoss += tx.amount;
    });

    const dynamicReports = Object.values(weeklyMap).sort((a, b) => new Date(b.generationDate) - new Date(a.generationDate));
    setReports(dynamicReports);

    // Calculate Intelligent Metrics
    const allTimeInc = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    
    const now = new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    currentMonday.setHours(0,0,0,0);
    
    const thisWeekInc = txs
      .filter(t => t.type === 'income' && new Date(t.date) >= currentMonday)
      .reduce((a, b) => a + b.amount, 0);

    setMetrics({ allTimeIncome: allTimeInc, thisWeekIncome: thisWeekInc });

    // Calculate Expense Breakdown for Ring Chart
    const expenseTxs = txs.filter(t => t.type === 'expense');
    const catMap = {};
    expenseTxs.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    setCategoryData(Object.keys(catMap).map(k => ({ name: k, value: catMap[k] })));
  }, []);

  return (
    <div className="main-content">
      <h1>Intelligent Reports</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '15px' }}>
          <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Total Income (This Week)</p>
          <h2 style={{ margin: '5px 0 0 0', color: 'var(--success)' }}>+₹{metrics.thisWeekIncome.toFixed(2)}</h2>
        </div>
        <div className="glass-card" style={{ padding: '15px' }}>
          <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Total Income (All Time)</p>
          <h2 style={{ margin: '5px 0 0 0', color: 'var(--success)' }}>+₹{metrics.allTimeIncome.toFixed(2)}</h2>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '30px', height: '280px', paddingBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center' }}>All-Time Expense Breakdown</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(val) => `₹${val.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-muted">No expenses yet</div>
        )}
      </div>

      <h2 style={{ fontSize: '18px', marginTop: '30px' }}>Weekly Reports</h2>
      <p className="text-muted" style={{ marginBottom: '20px', fontSize: '14px' }}>Auto-generated every Sunday for the past week</p>

      {reports.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '30px', height: '250px', paddingRight: '30px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reports.slice(0, 5).reverse()}>
              <XAxis dataKey="id" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" fontSize={10} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="totalGain" fill="#34D399" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="totalLoss" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {reports.map(r => (
          <div key={r.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{r.id}</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>{new Date(r.generationDate).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Total Gain</p>
                <p style={{ margin: 0, fontWeight: '700', color: '#34D399' }}>+₹{r.totalGain.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Total Loss</p>
                <p style={{ margin: 0, fontWeight: '700', color: '#F43F5E' }}>-₹{r.totalLoss.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p className="text-muted">No reports yet. Check back on Sunday!</p>
          </div>
        )}
      </div>
    </div>
  );
}
