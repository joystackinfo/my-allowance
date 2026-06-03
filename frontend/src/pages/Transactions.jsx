import { useState, useEffect, useCallback } from 'react';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionCard from '../components/TransactionCard';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [filter, setFilter] = useState('all');
    const [deleteError, setDeleteError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchTransactions = useCallback(async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    const filtered = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    const handleDelete = async (id) => {
        const shouldDelete = window.confirm('Delete this transaction?');
        if (!shouldDelete) return;
        setDeletingId(id);
        setDeleteError('');

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                setDeleteError(data.message || 'Delete failed');
            } else {
                setTransactions(prev => prev.filter(tx => tx._id !== id));
            }
        } catch (err) {
            setDeleteError('Something went wrong while deleting.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return (
        <div className="page">
            <div className="loader-wrapper">
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );

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

            {deleteError && <p className="error-msg">{deleteError}</p>}

            <div className="card">
                {filtered.length === 0 ? (
                    <p className="empty-state">No transactions yet. Add your first one! 💰</p>
                ) : (
                    filtered.map(tx => (
                        <TransactionCard
                            key={tx._id}
                            transaction={tx}
                            onDelete={handleDelete}
                            deleting={deletingId === tx._id}
                        />
                    ))
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