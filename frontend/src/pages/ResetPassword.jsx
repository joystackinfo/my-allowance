import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message); }
            else {
                setMessage('Password reset! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError('Something went wrong!');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h2>Reset password</h2>
                <p className="auth-sub">Enter your new password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>New Password</label>
                        <input type="password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter new password" required />
                    </div>
                    <div className="form-field">
                        <label>Confirm Password</label>
                        <input type="password" value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Confirm new password" required />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    {message && <p className="success-msg">✅ {message}</p>}
                    <button className="btn-primary" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;