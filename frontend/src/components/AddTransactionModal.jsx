import { useState } from 'react';

const EXPENSE_CATEGORIES = [
    'Food & Snacks',
    'Transport',
    'Airtime & Data',
    'Shopping',
    'Books & School',
    'Savings Transfer',
    'Other'
];

const INCOME_SOURCES = [
    'Allowance',
    'Gift',
    'Side Hustle',
    'Other'
];

const AddTransactionModal = ({ type, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ type, amount: Number(amount), category })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                setIsLoading(false);
                return;
            }

            onSuccess();

        } catch (err) {
            setError('Something went wrong!');
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{type === 'income' ? '+ Add Income' : '- Add Expense'}</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Amount (₦)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 2000"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>{type === 'income' ? 'Source' : 'Category'}</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">-- Select --</option>
                            {(type === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                        className={type === 'income' ? 'btn-primary' : 'btn-danger'}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;