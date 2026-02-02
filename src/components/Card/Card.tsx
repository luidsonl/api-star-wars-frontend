import styles from './Card.module.css';
import { SwapiResource, ResourceType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface CardProps {
    item: SwapiResource;
    type: ResourceType;
}

export default function Card({ item, type }: CardProps) {
    const { isFavorite, toggleFavorite, user } = useAuth();

    const id = item.url.split('/').filter(Boolean).pop() || '';
    const name = item.name || item.title;
    const favorited = isFavorite(type, id);

    return (
        <div className={`${styles.card} glass`}>
            <div className={styles.content}>
                <h3 className={styles.name}>{name}</h3>
                <span className={styles.type}>{type}</span>
            </div>

            <div className={styles.footer}>
                <Link href={`/${type}/${id}`} className={styles.detailsBtn}>
                    View Details
                </Link>

                {user && (
                    <button
                        onClick={() => toggleFavorite(type, id)}
                        className={`${styles.favBtn} ${favorited ? styles.active : ''}`}
                        aria-label="Toggle Favorite"
                    >
                        {favorited ? '★' : '☆'}
                    </button>
                )}
            </div>
        </div>
    );
}
