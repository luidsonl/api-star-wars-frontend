'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Card from '@/components/Card/Card';
import { SwapiResource } from '@/types';
import styles from './Favorites.module.css';

export default function FavoritesPage() {
    const { favorites, token } = useAuth();
    const [details, setDetails] = useState<Record<string, SwapiResource>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFavoriteDetails = async () => {
            if (favorites.length === 0) return;

            setLoading(true);
            const newDetails: Record<string, SwapiResource> = {};

            await Promise.all(favorites.map(async (fav) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/${fav.entity_type}/${fav.entity_id}`);
                    if (res.ok) {
                        newDetails[`${fav.entity_type}-${fav.entity_id}`] = await res.json();
                    }
                } catch (err) {
                    console.error(err);
                }
            }));

            setDetails(newDetails);
            setLoading(false);
        };

        fetchFavoriteDetails();
    }, [favorites]);

    if (!token) {
        return (
            <div className={styles.empty}>
                <h1 className="title-sw">Access Denied</h1>
                <p>Please login to view your favorites.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className="title-sw">Your Favorites</h1>

            {loading ? (
                <div className={styles.loader}>Tracking down your favorites across the galaxy...</div>
            ) : favorites.length === 0 ? (
                <p className={styles.emptyMsg}>You haven't saved any resources yet.</p>
            ) : (
                <div className={styles.grid}>
                    {favorites.map((fav) => {
                        const item = details[`${fav.entity_type}-${fav.entity_id}`];
                        if (!item) return null;
                        return <Card key={fav.id} item={item} type={fav.entity_type} />;
                    })}
                </div>
            )}
        </div>
    );
}
