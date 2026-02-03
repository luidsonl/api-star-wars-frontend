'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Campo exclusivo para registro
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        // Envia name apenas se for registro
        const payload = isRegister
            ? { email, password, name }
            : { email, password };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Action failed');

            if (!isRegister) {
                // No login, passamos os dados para o contexto
                login({ id: data.user.id, email: data.user.email, name: data.user.name }, data.access_token);
                router.push('/');
            } else {
                // No registro, apenas avisamos e limpamos o campo de nome
                setIsRegister(false);
                setError('Account created! Please login.');
                setName('');
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

                {/* Renderiza o campo Name APENAS no registro */}
                {isRegister && (
                    <div className={styles.group}>
                        <label>Name</label>
                        <input
                            type="text"
                            required={isRegister}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your display name"
                        />
                    </div>
                )}

                <div className={styles.group}>
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Corrigido de setUsername para setEmail
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
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                    }}
                    className={styles.switchBtn}
                >
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </form>
        </div>
    );
}