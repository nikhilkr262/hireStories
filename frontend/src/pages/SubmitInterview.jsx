import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function SubmitInterview() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL if editing
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        company: '',
        jobRole: '',
        experienceRange: '0-1',
        techStack: '',
        rounds: '',
        difficulty: 'Medium',
        result: 'Pending'
    });

    useEffect(() => {
        if (!user && !localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        if (isEditMode) {
            // Fetch existing data
            axios.get(`http://localhost:8082/interviews/${id}`)
                .then(res => {
                    // Start editing
                    // Verify ownership (optional here, backend enforces it on save)
                    if (user && res.data.authorUsername !== user.username) {
                        alert("You are not authorized to edit this.");
                        navigate('/browse');
                        return;
                    }

                    const data = res.data;
                    setFormData({
                        company: data.company,
                        jobRole: data.jobRole,
                        experienceRange: data.experienceRange,
                        techStack: data.techStack,
                        rounds: data.rounds,
                        difficulty: data.difficulty,
                        result: data.result
                    });
                })
                .catch(err => console.error("Failed to load interview", err));
        }
    }, [user, navigate, id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8082/interviews/${id}`, { ...formData, authorUsername: user.username }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Username': user.username
                    }
                });
                alert("Experience updated successfully!");
            } else {
                await axios.post('http://localhost:8082/interviews', { ...formData, authorUsername: user.username }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                alert("Experience shared successfully!");
            }
            navigate('/browse');
        } catch (err) {
            console.error(err);
            alert("Failed to save experience.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '4rem 0' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>{isEditMode ? 'Edit Interview Experience' : 'Share Interview Experience'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... form fields ... */}
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input name="company" value={formData.company} onChange={handleChange} className="form-input" required />
                    </div>
                    {/* ... other fields identical, just ensuring surround context ... */}
                    <div className="form-group">
                        <label className="form-label">Job Role</label>
                        <input name="jobRole" value={formData.jobRole} onChange={handleChange} className="form-input" required />
                    </div>
                    {/* ... skipping generic fields for brevity in tool call, relying on surrounding matches ... */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Experience Range</label>
                            <select name="experienceRange" value={formData.experienceRange} onChange={handleChange} className="form-input">
                                <option>0-1</option>
                                <option>1-3</option>
                                <option>3-5</option>
                                <option>5+</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Difficulty</label>
                            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="form-input">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tech Stack (comma separated)</label>
                        <input name="techStack" value={formData.techStack} onChange={handleChange} className="form-input" placeholder="e.g. Java, React, SQL" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Rounds Description</label>
                        <textarea name="rounds" value={formData.rounds} onChange={handleChange} className="form-input" rows="5" placeholder="Describe the rounds and questions asked..." required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Final Result</label>
                        <select name="result" value={formData.result} onChange={handleChange} className="form-input">
                            <option>Selected</option>
                            <option>Rejected</option>
                            <option>Pending</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isEditMode ? 'Update Experience' : 'Submit Experience'}
                    </button>
                </form>
            </div>
        </div>
    );
}
