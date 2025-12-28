export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--card-bg)',
            borderTop: '1px solid var(--border-color)',
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>&copy; {new Date().getFullYear()} HireStories. From Developers, For Developers.</p>
            </div>
        </footer>
    );
}
