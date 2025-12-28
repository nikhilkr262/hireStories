import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function InterviewDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    const fetchInterview = () => {
        const baseUrl = import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'http://localhost:8082';
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
            const baseUrl = import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'http://localhost:8082';
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
            const baseUrl = import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'http://localhost:8082';
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

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <Link to="/browse" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Browse</Link>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{interview.company}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{interview.jobRole}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{
                            display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600',
                            backgroundColor: interview.result === 'Selected' ? '#dcfce7' : interview.result === 'Rejected' ? '#fee2e2' : '#fef9c3',
                            color: interview.result === 'Selected' ? '#166534' : interview.result === 'Rejected' ? '#991b1b' : '#854d0e',
                            marginBottom: '0.5rem'
                        }}>
                            {interview.result}
                        </span>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Posted by {interview.authorUsername || 'Anonymous'}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Experience</span>
                        <span style={{ fontWeight: 600 }}>{interview.experienceRange}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Difficulty</span>
                        <span style={{ fontWeight: 600 }}>{interview.difficulty}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upvotes</span>
                        <span style={{ fontWeight: 600 }}>{interview.upvoteCount}</span>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Rounds & Questions</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{interview.rounds}</div>
                </div>

                {interview.techStack && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tech Stack</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {interview.techStack.split(',').map(tech => (
                                <span key={tech} style={{ backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <button onClick={handleUpvote} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>👍</span>
                        <span>Helpful ({interview.upvoteCount})</span>
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '3rem', maxWidth: '800px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Comments</h3>

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
                        <div key={comment.id} style={{ padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{comment.authorUsername}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
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
