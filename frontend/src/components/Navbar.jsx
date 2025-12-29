import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    HireStories
                </Link>

                <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/browse" className="nav-link" onClick={closeMenu}>Browse</Link>
                    <Link to="/resources" className="nav-link" onClick={closeMenu}>Resources</Link>

                    {user ? (
                        <div className="nav-user-section">
                            <Link to="/submit" className="nav-link" onClick={closeMenu}>Share Experience</Link>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Hello, <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.username}</span>
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="nav-user-section">
                            <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
