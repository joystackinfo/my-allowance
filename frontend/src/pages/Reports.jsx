import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#00695C', '#E53935', '#FF9800', '#9C27B0', '#2196F3', '#4CAF50'];

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/transactions/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setSummary(data);
            setLoading(false);
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="page"><p>Loading...</p></div>;

    // build category data for pie chart
    const categoryData = summary?.transactions
        ?.filter(tx => tx.type === 'expense')
        ?.reduce((acc, tx) => {
            const existing = acc.find(item => item.name === tx.category);
            if (existing) existing.value += tx.amount;
            else acc.push({ name: tx.category, value: tx.amount });
            return acc;
        }, []) || [];

    // spending personality
    const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];
    const personalities = {
        'Food & Snacks': { title: 'The Foodie 🍔', desc: 'You spend most on food — no shame, eat well!' },
        'Transport': { title: 'The Commuter 🚌', desc: 'Always on the move — you spend most on transport!' },
        'Airtime & Data': { title: 'The Data Burner 📱', desc: 'Always online — airtime is your biggest spend!' },
        'Shopping': { title: 'The Shopaholic 🛍️', desc: 'You love to shop — treat yourself responsibly!' },
        'Books & School': { title: 'The Scholar 📚', desc: 'Investing in knowledge — very smart!' },
    };
    const personality = personalities[topCategory?.name] || { title: 'The Balanced One ⚖️', desc: 'Your spending is well balanced!' };

    return (
        <div className="page">
            <h1 className="page-title">Reports</h1>

            {/* Summary cards */}
            <div className="summary-cards" style={{ marginBottom: '24px' }}>
                <div className="summary-card income">
                    <p>Total Income</p>
                    <h3>₦{(summary?.income || 0).toLocaleString()}</h3>
                </div>
                <div className="summary-card expense">
                    <p>Total Spent</p>
                    <h3>₦{(summary?.expense || 0).toLocaleString()}</h3>
                </div>
            </div>

            {/* Spending personality */}
            <div className="personality-card">
                <h3>{personality.title}</h3>
                <p>{personality.desc}</p>
            </div>

            {/* Pie chart */}
            {categoryData.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h3 className="chart-title">Spending Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name"
                                cx="50%" cy="50%" outerRadius={90} label>
                                {categoryData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {categoryData.length === 0 && (
                <div className="card">
                    <p className="empty-state">No expense data yet. Add some transactions! 📊</p>
                </div>
            )}
        </div>
    );
};

export default Reports;