import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [nickname, setNickname] = useState('');
    const [weeklyAllowance, setWeeklyAllowance] = useState('');
    const [weekStart, setWeekStart] = useState('sunday');
    const [brokeAlertThreshold, setBrokeAlertThreshold] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setNickname(user?.nickname || '');
        setWeeklyAllowance(user?.weeklyAllowance || '');
        setWeekStart(user?.weekStart || 'sunday');
        setBrokeAlertThreshold(user?.brokeAlertThreshold || 200);
    }, [user]);

    useEffect(() => {
        if (!saved) return;
        const timeout = setTimeout(() => setSaved(false), 6000);
        return () => clearTimeout(timeout);
    }, [saved]);

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
            body: JSON.stringify({
                nickname,
                weeklyAllowance: Number(weeklyAllowance),
                weekStart,
                brokeAlertThreshold: Number(brokeAlertThreshold)
            })
        });
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN', payload: data.user });
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="page">
            <h1 className="page-title">Profile</h1>

            {/* Avatar */}
            <div className="profile-avatar">
                <div className="avatar-circle">
                    {user?.nickname?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                </div>
            </div>

            {/* View mode */}
            {!editing && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="profile-view-row">
                        <span>Nickname</span>
                        <strong>{user?.nickname}</strong>
                    </div>
                    <div className="profile-view-row">
                        <span>Weekly Allowance</span>
                        <strong>₦{user?.weeklyAllowance?.toLocaleString()}</strong>
                    </div>
                    <div className="profile-view-row">
                        <span>Week starts on</span>
                        <strong>{user?.weekStart?.charAt(0).toUpperCase() + user?.weekStart?.slice(1)}</strong>
                    </div>
                    <div className="profile-view-row">
                        <span>Broke Alert Threshold</span>
                        <strong>₦{user?.brokeAlertThreshold?.toLocaleString()}</strong>
                    </div>
                    <button className="btn-outline"
                        onClick={() => setEditing(true)}
                        style={{ marginTop: '16px' }}>
                        Edit Profile
                    </button>
                </div>
            )}

            {/* Edit mode */}
            {editing && (
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
                            <label>Week starts on</label>
                            <select value={weekStart} onChange={e => setWeekStart(e.target.value)}>
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                            </select>
                            <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                                Choose whether your week begins on Sunday or Monday.
                            </small>
                        </div>
                        <div className="form-field">
                            <label>Broke Alert Threshold (₦)</label>
                            <input type="number" value={brokeAlertThreshold}
                                onChange={e => setBrokeAlertThreshold(e.target.value)} />
                            <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                                Alert shows when balance drops below this
                            </small>
                        </div>
                        {saved && <p className="success-msg">✅ Saved!</p>}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" type="submit">Save</button>
                            <button className="btn-outline" type="button"
                                onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <button className="btn-danger" onClick={handleLogout}
                style={{ width: '100%' }}>
                Log out
            </button>
        </div>
    );
};

export default Profile;