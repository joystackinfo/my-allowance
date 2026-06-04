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
        <>
            <nav className="navbar">
                <Link to={user ? '/dashboard' : '/'} className="nav-brand" onClick={closeMenu}>
                    MyAllowance
                </Link>

                <button
                    className={`nav-toggle${menuOpen ? ' open' : ''}`}
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle navigation"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>

            {/* Overlay */}
            {menuOpen && (
                <div className="drawer-overlay" onClick={closeMenu} />
            )}

            {/* Drawer */}
            <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
                <div className="drawer-header">
                    <span className="drawer-brand">MyAllowance</span>
                    <button className="drawer-close" onClick={closeMenu}>✕</button>
                </div>

                <div className="drawer-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={closeMenu}>🏠 Home</Link>
                            <Link to="/transactions" onClick={closeMenu}>💸 Transactions</Link>
                            <Link to="/reports" onClick={closeMenu}>📊 Reports</Link>
                            <Link to="/savings" onClick={closeMenu}>🎯 Savings</Link>
                            <Link to="/profile" onClick={closeMenu}>👤 Profile</Link>
                            <button className="drawer-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu}>Log in</Link>
                            <Link to="/signup" onClick={closeMenu}>Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;