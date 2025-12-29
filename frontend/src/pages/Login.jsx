import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import { getBaseUrl } from '../utils/config';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const baseUrl = getBaseUrl('auth');
            const res = await axios.post(`${baseUrl}/auth/login`, formData);
            login(res.data);
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data
                ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : err.response.data)
                : err.message || 'Invalid credentials';
            setError(errorMessage);
        }
    };

    return (
        <div className="container auth-container">
            <div className="card">
                <h2 className="auth-header">Welcome Back</h2>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username or Email</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn">
                        Login
                    </button>
                    <div className="auth-actions">
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Forgot Password?</Link>
                    </div>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
