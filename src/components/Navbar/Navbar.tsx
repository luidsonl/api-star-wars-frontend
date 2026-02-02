'use client';

import styles from './Navbar.module.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <nav className={`${styles.nav} glass`}>
            <div className={styles.container}>
                <Link href="/" className="title-sw">SW API</Link>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Search characters, planets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </form>

                <div className={styles.links}>
                    <Link href="/people">People</Link>
                    <Link href="/films">Films</Link>
                    <Link href="/planets">Planets</Link>
                    <Link href="/favorites">Favorites</Link>
                    {user ? (
                        <button onClick={logout} className={styles.authBtn}>Logout ({user.username})</button>
                    ) : (
                        <Link href="/login" className={styles.authBtn}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
