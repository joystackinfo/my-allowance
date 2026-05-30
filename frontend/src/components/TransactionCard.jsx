// TransactionCard.jsx
const TransactionCard = ({ transaction }) => {
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
                        {new Date(transaction.date).toLocaleDateString('en-NG', { // Format date as "Mon, Jan 1"
                            weekday: 'short', month: 'short', day: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            <span className={`tx-amount ${transaction.type}`}> 
                {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount?.toLocaleString()}  
            </span> 
        </div>
    );
};

export default TransactionCard;