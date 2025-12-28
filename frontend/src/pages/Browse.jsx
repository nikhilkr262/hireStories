import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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

        axios.get('http://localhost:8082/interviews', { params })
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
                await axios.delete(`http://localhost:8082/interviews/${id}`, {
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
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Browse Experiences</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Company..."
                        className="form-input"
                        style={{ width: '200px' }}
                        value={filters.company}
                        onChange={e => setFilters({ ...filters, company: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Role..."
                        className="form-input"
                        style={{ width: '200px' }}
                        value={filters.jobRole}
                        onChange={e => setFilters({ ...filters, jobRole: e.target.value })}
                    />
                    <button onClick={fetchInterviews} className="btn btn-primary">Search</button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {interviews.map(interview => (
                        <div key={interview.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{interview.company} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>| {interview.jobRole}</span></h3>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', padding: '0.1rem 0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>{interview.experienceRange} exp</span>
                                    <span style={{ fontSize: '0.875rem', padding: '0.1rem 0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>{interview.difficulty}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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

