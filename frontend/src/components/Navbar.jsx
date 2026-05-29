import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // remove token from localStorage
        localStorage.removeItem('token');
        // update AuthContext
        dispatch({ type: 'LOGOUT' });
        // redirect to landing page
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to={user ? '/dashboard' : '/'} className="nav-brand">
                MyAllowance
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/dashboard">Home</Link>
                        <Link to="/transactions">Transactions</Link>
                        <Link to="/reports">Reports</Link>
                        <Link to="/savings">Savings</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log in</Link>
                        <Link to="/signup">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;