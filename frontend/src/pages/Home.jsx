import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch recent interviews
        axios.get('http://localhost:8082/interviews')
            .then(res => setInterviews(res.data.slice(0, 3))) // Show top 3
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleReadMore = (id) => {
        if (!user) {
            if (window.confirm("You need to login to read the full story. Go to login?")) {
                navigate('/login');
            }
        } else {
            navigate(`/interviews/${id}`);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem',
                    background: 'linear-gradient(135deg, var(--primary), #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                    HireStories
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    From Developers, For Developers.
                </p>
                <p style={{ maxWidth: '600px', margin: '1rem auto 2rem', color: 'var(--text-secondary)' }}>
                    Discover real interview experiences shared by engineers worldwide.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/browse" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                        Start Reading
                    </Link>
                    <Link to="/submit" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                        Share Experience
                    </Link>
                </div>
            </header>

            <section>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Recent Stories</h2>
                {loading ? (
                    <p>Loading stories...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {interviews.map(interview => (
                            <div key={interview.id} className="card">
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{interview.company}</h3>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{interview.jobRole}</span>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{
                                        display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600',
                                        backgroundColor: interview.result === 'Selected' ? '#dcfce7' : interview.result === 'Rejected' ? '#fee2e2' : '#fef9c3',
                                        color: interview.result === 'Selected' ? '#166534' : interview.result === 'Rejected' ? '#991b1b' : '#854d0e'
                                    }}>
                                        {interview.result}
                                    </span>
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {interview.difficulty}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {interview.rounds}
                                </p>
                                <button
                                    onClick={() => handleReadMore(interview.id)}
                                    style={{
                                        background: 'none', border: 'none', padding: 0,
                                        color: 'var(--primary)', fontWeight: '500', fontSize: '0.875rem',
                                        cursor: 'pointer', textDecoration: 'underline'
                                    }}
                                >
                                    Read Full Story &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
