'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { swapiService } from '@/services/api';
import { SwapiResource, ResourceType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import styles from './Details.module.css';

export default function DetailsPage({ resourceType }: { resourceType: ResourceType }) {
    const { id } = useParams();
    const router = useRouter();
    const { isFavorite, toggleFavorite, user } = useAuth();
    const [item, setItem] = useState<SwapiResource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const loadItem = async () => {
            try {
                const data = await swapiService.fetchResourceById<SwapiResource>(resourceType, id as string);
                setItem(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id, resourceType]);

    if (loading) return <div className={styles.loader}>Accessing archives...</div>;
    if (!item) return <div className={styles.error}>Resource not found in the galaxy.</div>;

    const favorited = isFavorite(resourceType, id as string);

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>← Back</button>

            <div className={`${styles.content} glass`}>
                <div className={styles.header}>
                    <h1 className="title-sw">{item.name || item.title}</h1>
                    {user && (
                        <button
                            onClick={() => toggleFavorite(resourceType, id as string)}
                            className={`${styles.favBtn} ${favorited ? styles.active : ''}`}
                        >
                            {favorited ? 'In Favorites ★' : 'Add to Favorites ☆'}
                        </button>
                    )}
                </div>

                <div className={styles.infoGrid}>
                    {Object.entries(item).map(([key, value]) => {
                        if (typeof value !== 'string' || value.startsWith('http') || ['created', 'edited', 'url'].includes(key)) return null;
                        return (
                            <div key={key} className={styles.infoBox}>
                                <span className={styles.label}>{key.replace(/_/g, ' ')}</span>
                                <span className={styles.value}>{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
