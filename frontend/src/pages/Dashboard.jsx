import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import BrokeAlert from '../components/BrokeAlert';
import TransactionCard from '../components/TransactionCard';
import AddTransactionModal from '../components/AddTransactionModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('income');

    const fetchSummary = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/transactions/weekly', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    if (loading) return <div className="page"><p>Loading...</p></div>;

    return (
        <div className="page">
            <h1 className="page-title">Hi {user?.nickname} 👋</h1>

            {/* Broke Alert */}
            {summary?.balance <= user?.brokeAlertThreshold && (
                <BrokeAlert balance={summary?.balance} />
            )}

            {/* Balance Card */}
            <div className="balance-card">
                <p>This week's balance</p>
                <h2>₦{((summary?.balance || 0)).toLocaleString()}</h2>
                <div className="balance-bar-wrap">
                    <div
                        className="balance-bar"
                        style={{
                            width: `${Math.min(((summary?.balance || 0) / (user?.weeklyAllowance || 1)) * 100, 100)}%`
                        }}
                    ></div>
                </div>
                <span>{Math.round(((summary?.balance || 0) / (user?.weeklyAllowance || 1)) * 100)}% of ₦{user?.weeklyAllowance?.toLocaleString()} remaining</span> 
            </div>

            {/* Income and Expense Cards */}
            <div className="summary-cards">
                <div className="summary-card income"> 
                    <p>Income</p>
                    <h3>₦{((summary?.income || 0)).toLocaleString()}</h3>
                </div>
                <div className="summary-card expense">
                    <p>Spent</p>
                    <h3>₦{((summary?.expense || 0)).toLocaleString()}</h3>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-btns">
                <button className="btn-primary" onClick={() => openModal('income')}>
                    + Add Income
                </button>
                <button className="btn-danger" onClick={() => openModal('expense')}>
                    - Add Expense
                </button>
            </div>

            {/* Savings Goal Preview */}
            <div className="section-header">
                <h3>Savings Goals</h3>
                <Link to="/savings">See all →</Link>
            </div>

            {/* Recent Transactions */}
            <div className="section-header">
                <h3>Recent Transactions</h3>
                <Link to="/transactions">See all →</Link>
            </div>

            {summary?.transactions?.slice(0, 3).map(tx => (
                <TransactionCard key={tx._id} transaction={tx} />
            ))}

            {/* Add Transaction Modal */}
            {showModal && (
                <AddTransactionModal
                    type={modalType}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchSummary();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;