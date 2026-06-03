import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to={user ? '/dashboard' : '/'} className="nav-brand" onClick={closeMenu}>
                MyAllowance
            </Link>

            <button
                className={`nav-toggle${menuOpen ? ' open' : ''}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation"
            >
                <span />
                <span />
                <span />
            </button>

            <div className={`nav-links${menuOpen ? ' open' : ''}`}>
                {user ? (
                    <>
                        <Link to="/dashboard" onClick={closeMenu}>Home</Link>
                        <Link to="/transactions" onClick={closeMenu}>Transactions</Link>
                        <Link to="/reports" onClick={closeMenu}>Reports</Link>
                        <Link to="/savings" onClick={closeMenu}>Savings</Link>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>Log in</Link>
                        <Link to="/signup" onClick={closeMenu}>Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;