import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { getBaseUrl } from '../utils/config';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            // Direct call to Auth Service (Port 8081)
            const baseUrl = getBaseUrl('auth');
            await axios.post(`${baseUrl}/auth/forgot-password`, { email });
            setMessage('OTP sent to your email! (Check backend console for local dev)');
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message
                || (typeof err.response?.data === 'object' ? JSON.stringify(err.response.data) : err.response?.data)
                || 'Failed to send OTP. User may not exist.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const baseUrl = getBaseUrl('auth');
            await axios.post(`${baseUrl}/auth/reset-password`, {
                email,
                otp,
                newPassword
            });
            alert('Password reset successful! You can now login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message
                || (typeof err.response?.data === 'object' ? JSON.stringify(err.response.data) : err.response?.data)
                || 'Failed to reset password. Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <div className="card">
                <h2 className="auth-header">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>

                {message && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
                {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <button disabled={loading} className="btn btn-primary auth-btn">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">Enter OTP</label>
                            <input
                                type="text"
                                className="form-input"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                placeholder="6-digit code"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button disabled={loading} className="btn btn-primary auth-btn">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn btn-outline auth-btn"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Back
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
