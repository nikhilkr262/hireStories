import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth(); // We need user info for uploading

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('PDF'); // PDF, URL, DOCUMENT, OTHER
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setError(null);
        try {
            // Direct call to Interview Service (Port 8082)
            const res = await axios.get('http://localhost:8082/resources');
            setResources(res.data);
        } catch (err) {
            console.error("Failed to fetch resources", err);
            setError("Failed to load resources. Error: " + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to share a resource.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        if (type === 'URL') {
            formData.append('url', url);
        } else if (file) {
            formData.append('file', file);
        }

        setUploading(true);
        try {
            await axios.post('http://localhost:8082/resources', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Username': user.username
                }
            });
            setShowModal(false);
            setTitle('');
            setDescription('');
            setFile(null);
            setUrl('');
            fetchResources();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload resource. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await axios.delete(`http://localhost:8082/resources/${id}`, {
                    headers: { 'X-Username': user.username }
                });
                fetchResources();
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete.");
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return '📄';
            case 'URL': return '🔗';
            case 'DOCUMENT': return '📝';
            default: return '📦';
        }
    };

    const navigate = useNavigate();
    const handleDownload = (id) => {
        if (!user) {
            if (window.confirm("You need to login to download this resource. Go to login?")) {
                navigate('/login');
            }
        } else {
            // Trigger download via window.location or open in new tab
            window.open(`http://localhost:8082/resources/${id}/download`, '_blank');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            {/* Header ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Learning Resources</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Share and discover materials for interview preparation.</p>
                </div>
                {user && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Share Resource
                    </button>
                )}
            </div>

            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading resources...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {resources.map(res => (
                        <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>{getIcon(res.type)}</span>
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                    {res.type}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{res.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, marginBottom: '1rem' }}>
                                {res.description || 'No description provided.'}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>By <strong>{res.username}</strong></span>
                                    {user && user.username === res.username && (
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            style={{
                                                background: 'none', border: 'none', padding: 0,
                                                color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', textDecoration: 'underline'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                {res.type === 'URL' ? (
                                    <a href={res.contentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                        Visit Link ↗
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => handleDownload(res.id)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                                    >
                                        Download ↓
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {resources.length === 0 && !error && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            No resources shared yet. Be the first!
                        </div>
                    )}
                </div>
            )}

            {/* Upload Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Share a Resource</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                                    <option value="PDF">PDF Document</option>
                                    <option value="URL">Website Link (URL)</option>
                                    <option value="DOCUMENT">Word/Text Doc</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {type === 'URL' ? (
                                <div className="form-group">
                                    <label className="form-label">Link URL</label>
                                    <input type="url" className="form-input" value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://..." />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Upload File</label>
                                    <input type="file" className="form-input" onChange={handleFileChange} required />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={uploading} style={{ flex: 1 }}>
                                    {uploading ? 'Uploading...' : 'Share'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
