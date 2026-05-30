import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setIsLoading(false);
                return;
            }

            // save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Save user data to localStorage

            // update AuthContext
            dispatch({ type: 'LOGIN', payload: data.user });

            // redirect to dashboard
            navigate('/dashboard');

        } catch (err) {
            setError('Something went wrong. Try again!');
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h2>Welcome back</h2>
                <p className="auth-sub">Log in to your account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;