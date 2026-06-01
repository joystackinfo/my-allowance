import { useState, useEffect } from 'react';

const Savings = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [emoji, setEmoji] = useState('🎯');
    const [addingTo, setAddingTo] = useState(null);
    const [addAmount, setAddAmount] = useState('');

    const token = localStorage.getItem('token');

    const fetchGoals = async () => {
        const res = await fetch('http://localhost:5000/api/goals', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setGoals(data);
        setLoading(false);
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, targetAmount: Number(targetAmount), emoji })
        });
        setShowForm(false);
        setName(''); setTargetAmount(''); setEmoji('🎯');
        fetchGoals();
    };

    const handleAddMoney = async (goalId) => {
        await fetch(`http://localhost:5000/api/goals/${goalId}/add-money`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ amount: Number(addAmount) })
        });
        setAddingTo(null);
        setAddAmount('');
        fetchGoals();
    };

    const handleDelete = async (goalId) => {
        if (!window.confirm('Delete this goal?')) return;
        await fetch(`http://localhost:5000/api/goals/${goalId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchGoals();
    };

    if (loading) return <div className="page"><p>Loading...</p></div>;

    return (
        <div className="page">
            <h1 className="page-title">Savings Goals</h1>

            <button className="btn-primary" onClick={() => setShowForm(!showForm)}
                style={{ marginBottom: '24px' }}>
                {showForm ? 'Cancel' : '+ New Goal'}
            </button>

            {showForm && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <form onSubmit={handleAddGoal}>
                        <div className="form-field">
                            <label>Goal Name</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                placeholder="e.g. New Sneakers" required />
                        </div>
                        <div className="form-field">
                            <label>Target Amount (₦)</label>
                            <input type="number" value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                placeholder="e.g. 20000" required />
                        </div>
                        <div className="form-field">
                            <label>Emoji</label>
                            <input value={emoji} onChange={e => setEmoji(e.target.value)}
                                placeholder="🎯" />
                        </div>
                        <button className="btn-primary" type="submit">Save Goal</button>
                    </form>
                </div>
            )}

            {goals.length === 0 ? (
                <div className="card">
                    <p className="empty-state">No savings goals yet. Create your first one! 🎯</p>
                </div>
            ) : (
                goals.map(goal => {
                    const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
                    return (
                        <div key={goal._id} className="goal-card-full">
                            <div className="goal-card-header">
                                <div>
                                    <h3>{goal.emoji} {goal.name}</h3>
                                    <p>₦{goal.savedAmount?.toLocaleString()} saved of ₦{goal.targetAmount?.toLocaleString()}</p>
                                </div>
                                <span className="goal-percent">{percent}%</span>
                            </div>
                            <div className="goal-progress-wrap">
                                <div className="goal-progress-bar" style={{ width: `${percent}%` }}></div>
                            </div>
                            {addingTo === goal._id ? (
                                <div className="goal-add-money">
                                    <input type="number" value={addAmount}
                                        onChange={e => setAddAmount(e.target.value)}
                                        placeholder="Amount to add (₦)" />
                                    <button className="btn-primary" onClick={() => handleAddMoney(goal._id)}>Add</button>
                                    <button className="btn-outline" onClick={() => setAddingTo(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="goal-actions">
                                    <button className="btn-primary" onClick={() => setAddingTo(goal._id)}>+ Add Money</button>
                                    <button className="btn-outline" onClick={() => handleDelete(goal._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Savings;