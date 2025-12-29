import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Browse.css';
import { getBaseUrl } from '../utils/config';

export default function Browse() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ company: '', jobRole: '' });
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchInterviews = () => {
        setLoading(true);
        const params = {};
        if (filters.company) params.company = filters.company;
        if (filters.jobRole) params.jobRole = filters.jobRole;

        const baseUrl = getBaseUrl('interview');
        axios.get(`${baseUrl}/interviews`, { params })
            .then(res => setInterviews(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInterviews();
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            try {
                const baseUrl = getBaseUrl('interview');
                await axios.delete(`${baseUrl}/interviews/${id}`, {
                    headers: { 'X-Username': user.username }
                });
                fetchInterviews(); // Refresh list
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete. You might not be authorized.");
            }
        }
    };

    return (
        <div className="container browse-container">
            <div className="browse-header">
                <h2 className="browse-title">Browse Experiences</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Company..."
                        className="form-input search-input"
                        value={filters.company}
                        onChange={e => setFilters({ ...filters, company: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Role..."
                        className="form-input search-input"
                        value={filters.jobRole}
                        onChange={e => setFilters({ ...filters, jobRole: e.target.value })}
                    />
                    <button onClick={fetchInterviews} className="btn btn-primary">Search</button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="browse-list">
                    {interviews.map(interview => (
                        <div key={interview.id} className="card browse-card">
                            <div className="browse-card-content">
                                <h3 className="browse-card-title">{interview.company} <span className="browse-card-subtitle">| {interview.jobRole}</span></h3>
                                <div className="browse-card-meta">
                                    <span className="meta-badge">{interview.experienceRange} exp</span>
                                    <span className="meta-badge">{interview.difficulty}</span>
                                </div>
                            </div>
                            <div className="browse-card-actions">
                                {user && user.username === interview.authorUsername && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/edit-experience/${interview.id}`)}
                                            className="btn btn-outline"
                                            style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(interview.id)}
                                            className="btn btn-outline"
                                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                <button onClick={() => handleReadMore(interview.id)} className="btn btn-outline">Read More</button>
                            </div>
                        </div>
                    ))}
                    {interviews.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No interviews found.</p>}
                </div>
            )}
        </div>
    );
}

