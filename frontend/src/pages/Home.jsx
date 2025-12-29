import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
import { getBaseUrl } from '../utils/config';

export default function Home() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch recent interviews
        const baseUrl = getBaseUrl('interview');
        axios.get(`${baseUrl}/interviews`)
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

    const getBadgeClass = (result) => {
        if (result === 'Selected') return 'story-badge selected';
        if (result === 'Rejected') return 'story-badge rejected';
        return 'story-badge pending';
    };

    return (
        <div className="container home-container">
            <header className="hero-section">
                <h1 className="hero-title">
                    HireStories
                </h1>
                <p className="hero-subtitle">
                    From Developers, For Developers.
                </p>
                <p className="hero-description">
                    Discover real interview experiences shared by engineers worldwide.
                </p>
                <div className="hero-buttons">
                    <Link to="/browse" className="btn btn-primary hero-btn">
                        Start Reading
                    </Link>
                    <Link to="/submit" className="btn btn-outline hero-btn">
                        Share Experience
                    </Link>
                </div>
            </header>

            <section>
                <h2 className="section-title">Recent Stories</h2>
                {loading ? (
                    <p>Loading stories...</p>
                ) : (
                    <div className="stories-grid">
                        {interviews.map(interview => (
                            <div key={interview.id} className="card">
                                <div className="story-header">
                                    <h3>{interview.company}</h3>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{interview.jobRole}</span>
                                </div>
                                <div className="story-meta">
                                    <span className={getBadgeClass(interview.result)}>
                                        {interview.result}
                                    </span>
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {interview.difficulty}
                                    </span>
                                </div>
                                <p className="story-excerpt">
                                    {interview.rounds}
                                </p>
                                <button
                                    onClick={() => handleReadMore(interview.id)}
                                    className="read-more-btn"
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
