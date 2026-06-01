import { useState, useEffect } from 'react';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionCard from '../components/TransactionCard';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [filter, setFilter] = useState('all');

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/transactions', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
    };

    useEffect(() => { fetchTransactions(); }, []);

    const filtered = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    if (loading) return <div className="page"><p>Loading...</p></div>;

    return (
        <div className="page">
            <h1 className="page-title">Transactions</h1>

            <div className="action-btns">
                <button className="btn-primary" onClick={() => { setModalType('income'); setShowModal(true); }}>
                    + Add Income
                </button>
                <button className="btn-danger" onClick={() => { setModalType('expense'); setShowModal(true); }}>
                    - Add Expense
                </button>
            </div>

            <div className="filter-tabs">
                <button className={filter === 'all' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'income' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('income')}>Income</button>
                <button className={filter === 'expense' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('expense')}>Expenses</button>
            </div>

            <div className="card">
                {filtered.length === 0 ? (
                    <p className="empty-state">No transactions yet. Add your first one! 💰</p>
                ) : (
                    filtered.map(tx => <TransactionCard key={tx._id} transaction={tx} />)
                )}
            </div>

            {showModal && (
                <AddTransactionModal
                    type={modalType}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchTransactions(); }}
                />
            )}
        </div>
    );
};

export default Transactions;