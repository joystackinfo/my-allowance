import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('/'), 3000);
    }, []);

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h2>404 — Page Not Found</h2>
                <p className="auth-sub">Oops! This page doesn't exist.</p>
                <p className="auth-sub">Redirecting you home in 3 seconds...</p>
            </div>
        </div>
    );
};

export default NotFound;