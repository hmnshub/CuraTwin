import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Sign in to access your digital twin dashboard</p>
                </div>

                {error && <div style={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.button}>Sign In</button>
                </form>

                <p style={styles.footerText}>
                    Don't have an account? <Link to="/register" style={styles.link}>Create one</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '1rem',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        padding: '2.5rem',
        border: '1px solid #e2e8f0',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#64748b',
        margin: 0,
    },
    errorBanner: {
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        marginBottom: '1.5rem',
        border: '1px solid #fee2e2',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#334155',
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        marginTop: '0.5rem',
        padding: '0.85rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '0.95rem',
        cursor: 'pointer',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#64748b',
        marginTop: '1.75rem',
        marginBottom: 0,
    },
    link: {
        color: '#2563eb',
        fontWeight: '600',
        textDecoration: 'none',
    },
};