import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [weeklyAllowance, setWeeklyAllowance] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useAuth(); // get dispatch from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page from refreshing on form submit
        setIsLoading(true); // show loading state
        setError(null); // do not show previous error messages

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, nickname, email, password, weeklyAllowance })
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
                <h2>Create account</h2>
                <p className="auth-sub">Start tracking your allowance today</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // control the input with state
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="What should we call you?"
                            required
                        />
                    </div>
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Weekly Allowance (₦)</label>
                        <input
                            type="number"
                            value={weeklyAllowance}
                            onChange={(e) => setWeeklyAllowance(e.target.value)}
                            placeholder="e.g. 2000"
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;