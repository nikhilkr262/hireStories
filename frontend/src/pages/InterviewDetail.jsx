import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Interview.css';
import { getBaseUrl } from '../utils/config';

export default function InterviewDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    const fetchInterview = () => {
        const baseUrl = getBaseUrl('interview');
        axios.get(`${baseUrl}/interviews/${id}`)
            .then(res => setInterview(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInterview();
    }, [id]);

    const handleUpvote = async () => {
        if (!user) return alert('Login to upvote');
        try {
            const baseUrl = getBaseUrl('interview');
            await axios.post(`${baseUrl}/interviews/${id}/upvote`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchInterview(); // Refresh to see count update
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert('Login to comment');
        try {
            const baseUrl = getBaseUrl('interview');
            await axios.post(`${baseUrl}/interviews/${id}/comments`, {
                content: newComment,
                authorUsername: user.username
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewComment('');
            fetchInterview(); // Refresh comments
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem 0' }}>Loading...</div>;
    if (!interview) return <div className="container" style={{ padding: '4rem 0' }}>Interview not found</div>;

    const getResultColor = (result) => {
        if (result === 'Selected') return { bg: '#dcfce7', text: '#166534' };
        if (result === 'Rejected') return { bg: '#fee2e2', text: '#991b1b' };
        return { bg: '#fef9c3', text: '#854d0e' };
    };
    const resultColor = getResultColor(interview.result);

    return (
        <div className="container interview-container">
            <Link to="/browse" className="back-link">&larr; Back to Browse</Link>

            <div className="card">
                <div className="interview-header">
                    <div>
                        <h1 className="interview-title">{interview.company}</h1>
                        <p className="interview-role">{interview.jobRole}</p>
                    </div>
                    <div className="interview-meta-header">
                        <span style={{
                            display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600',
                            backgroundColor: resultColor.bg,
                            color: resultColor.text,
                            marginBottom: '0.5rem'
                        }}>
                            {interview.result}
                        </span>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Posted by {interview.authorUsername || 'Anonymous'}</div>
                    </div>
                </div>

                <div className="interview-stats-grid">
                    <div>
                        <span className="stat-label">Experience</span>
                        <span className="stat-value">{interview.experienceRange}</span>
                    </div>
                    <div>
                        <span className="stat-label">Difficulty</span>
                        <span className="stat-value">{interview.difficulty}</span>
                    </div>
                    <div>
                        <span className="stat-label">Upvotes</span>
                        <span className="stat-value">{interview.upvoteCount}</span>
                    </div>
                </div>

                <div className="interview-section">
                    <h3 className="section-subtitle">Rounds & Questions</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{interview.rounds}</div>
                </div>

                {interview.techStack && (
                    <div className="interview-section">
                        <h3 className="section-subtitle">Tech Stack</h3>
                        <div className="tech-stack-container">
                            {interview.techStack.split(',').map(tech => (
                                <span key={tech} className="tech-tag">
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="interview-footer">
                    <button onClick={handleUpvote} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>👍</span>
                        <span>Helpful ({interview.upvoteCount})</span>
                    </button>
                </div>
            </div>

            <div className="comments-section">
                <h3 className="comments-title">Comments</h3>

                {user && (
                    <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
                        <textarea
                            className="form-input"
                            rows="3"
                            placeholder="Ask a question or share your thoughts..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Post Comment</button>
                    </form>
                )}

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {interview.comments && interview.comments.map(comment => (
                        <div key={comment.id} className="comment-card">
                            <div className="comment-header">
                                <span className="comment-author">{comment.authorUsername}</span>
                                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem' }}>{comment.content}</p>
                        </div>
                    ))}
                    {(!interview.comments || interview.comments.length === 0) && <p style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>}
                </div>
            </div>
        </div>
    );
}
