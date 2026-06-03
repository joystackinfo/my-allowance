// TransactionCard.jsx
const TransactionCard = ({ transaction, onDelete, deleting }) => {
    const icons = {
        'Food & Snacks': '🍔',
        'Transport': '🚌',
        'Airtime & Data': '📱',
        'Shopping': '🛍️',
        'Books & School': '📚',
        'Savings Transfer': '💰',
        'Allowance': '💰',
        'Gift': '🎁',
        'Side Hustle': '💼',
        'Other': '💳'
    };

    return (
        <div className="tx-card">
            <div className="tx-left">
                <span className="tx-icon">
                    {icons[transaction.category] || '💳'}
                </span>
                <div>
                    <p className="tx-name">{transaction.category}</p>
                    <p className="tx-date">
                        {new Date(transaction.date).toLocaleDateString('en-NG', {
                            weekday: 'short', month: 'short', day: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            <div className="tx-right">
                <span className={`tx-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount?.toLocaleString()}
                </span>
                {onDelete && (
                    <button
                        type="button"
                        className="tx-delete-btn"
                        onClick={() => onDelete(transaction._id)}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;