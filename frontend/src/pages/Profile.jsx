import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [weeklyAllowance, setWeeklyAllowance] = useState(user?.weeklyAllowance || '');
    const [brokeAlertThreshold, setBrokeAlertThreshold] = useState(user?.brokeAlertThreshold || 200);
    const [saved, setSaved] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ nickname, weeklyAllowance: Number(weeklyAllowance), brokeAlertThreshold: Number(brokeAlertThreshold) })
        });
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN', payload: data.user });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="page">
            <h1 className="page-title">Profile</h1>

            <div className="profile-avatar">
                <div className="avatar-circle">
                    {user?.nickname?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <form onSubmit={handleSave}>
                    <div className="form-field">
                        <label>Nickname</label>
                        <input value={nickname} onChange={e => setNickname(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Weekly Allowance (₦)</label>
                        <input type="number" value={weeklyAllowance}
                            onChange={e => setWeeklyAllowance(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Broke Alert Threshold (₦)</label>
                        <input type="number" value={brokeAlertThreshold}
                            onChange={e => setBrokeAlertThreshold(e.target.value)} />
                        <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                            Alert shows when balance drops below this amount
                        </small>
                    </div>
                    {saved && <p style={{ color: 'var(--primary)', marginBottom: '12px' }}>✅ Saved successfully!</p>}
                    <button className="btn-primary" type="submit">Save Changes</button>
                </form>
            </div>

            <button className="btn-danger" onClick={handleLogout} style={{ width: '100%' }}>
                Log out
            </button>
        </div>
    );
};

export default Profile;