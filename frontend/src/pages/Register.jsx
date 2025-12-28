import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const baseUrl = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081';
            await axios.post(`${baseUrl}/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data
                ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : err.response.data)
                : err.message || 'Registration failed.';
            setError(errorMessage);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
