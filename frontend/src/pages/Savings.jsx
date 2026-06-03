import { useState, useEffect, useCallback } from 'react';

const Savings = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [emoji, setEmoji] = useState('🎯');
    const [addingTo, setAddingTo] = useState(null);
    const [addAmount, setAddAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const fetchGoals = useCallback(async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goals`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setGoals(data);
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    useEffect(() => {
        if (!successMessage && !errorMessage) return;
        const timeout = setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 6000);
        return () => clearTimeout(timeout);
    }, [successMessage, errorMessage]);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        setIsSavingGoal(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (!name.trim() || Number(targetAmount) <= 0) {
            setErrorMessage('Enter a valid goal name and target amount.');
            setIsSavingGoal(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, targetAmount: Number(targetAmount), emoji })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not save goal');
            setSuccessMessage('Goal saved successfully!');
            setShowForm(false);
            setName(''); setTargetAmount(''); setEmoji('🎯');
            fetchGoals();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to save goal.');
        } finally {
            setIsSavingGoal(false);
        }
    };

    const handleAddMoney = async (goalId) => {
        if (Number(addAmount) <= 0) {
            setErrorMessage('Enter an amount greater than zero.');
            return;
        }

        setIsAddingMoney(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goals/${goalId}/add-money`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ amount: Number(addAmount) })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not add money');
            setSuccessMessage(`₦${Number(addAmount).toLocaleString()} added to your goal!`);
            setAddingTo(null);
            setAddAmount('');
            fetchGoals();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to add amount.');
        } finally {
            setIsAddingMoney(false);
        }
    };

    const handleDelete = async (goalId) => {
        if (!window.confirm('Delete this goal?')) return;
        await fetch(`${process.env.REACT_APP_API_URL}/api/goals/${goalId}`, {
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

            {successMessage && <p className="success-msg">✅ {successMessage}</p>}
            {errorMessage && <p className="error-msg">{errorMessage}</p>}

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
                        <button className="btn-primary" type="submit" disabled={isSavingGoal}>
                            {isSavingGoal ? 'Saving...' : 'Save Goal'}
                        </button>
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
                    const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
                    const completed = percent >= 100;

                    return (
                        <div key={goal._id} className="goal-card-full">
                            <div className="goal-card-header">
                                <div>
                                    <h3>{goal.emoji} {goal.name}</h3>
                                    <p>₦{goal.savedAmount?.toLocaleString()} saved of ₦{goal.targetAmount?.toLocaleString()}</p>
                                </div>
                                <span className={`goal-percent ${completed ? 'goal-complete-badge' : ''}`}>{completed ? 'Complete' : `${percent}%`}</span>
                            </div>
                            <div className="goal-progress-wrap">
                                <div className="goal-progress-bar" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div className="goal-progress-meta">
                                <span>{completed ? 'Goal reached 🎉' : `₦${remaining.toLocaleString()} remaining`}</span>
                                <span>{percent}% complete</span>
                            </div>

                            {completed ? (
                                <div className="goal-actions">
                                    <button className="btn-outline" onClick={() => handleDelete(goal._id)}>Remove Goal</button>
                                </div>
                            ) : addingTo === goal._id ? (
                                <div className="goal-add-money">
                                    <input type="number" value={addAmount}
                                        onChange={e => setAddAmount(e.target.value)}
                                        placeholder="Amount to add (₦)" />
                                    <button className="btn-primary" onClick={() => handleAddMoney(goal._id)} disabled={isAddingMoney}>
                                        {isAddingMoney ? 'Saving...' : 'Add'}
                                    </button>
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