// BrokeAlert.jsx
const BrokeAlert = ({ balance }) => {
    return (
        <div className="broke-alert">
            ⚠️ Your balance is running low — ₦{balance?.toLocaleString()} left this week!
        </div>
    );
};

export default BrokeAlert;