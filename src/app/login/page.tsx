'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            if (!isRegister) {
                login({ id: data.user_id, username }, data.access_token);
                router.push('/');
            } else {
                setIsRegister(false);
                setError('Account created! Please login.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
                <h1 className="title-sw">{isRegister ? 'Join the Empire' : 'Welcome Back'}</h1>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.group}>
                    <label>Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className={styles.group}>
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.submitBtn}>
                    {isRegister ? 'Register' : 'Login'}
                </button>

                <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className={styles.switchBtn}
                >
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </form>
        </div>
    );
}
