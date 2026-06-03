import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Reset link sent to your email.');
      } else {
        setError(data.message || 'Unable to process request.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
    
  };

    return (
        <div className="auth-page"> 
            <div className="auth-box">
                <h2>Forgot Password?</h2>
                <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
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

                {error && <p className="error-msg">{error}</p>}
                {message && <p className="success-msg">✅{message}</p>}
                   <button className="btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="auth-switch">
                    Remembered? <Link to="/login">Log in </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgetPassword;