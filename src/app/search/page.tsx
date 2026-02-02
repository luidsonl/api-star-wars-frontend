'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { swapiService } from '@/services/api';
import { SwapiResource, ResourceType } from '@/types';
import Card from '@/components/Card/Card';
import styles from './Search.module.css';

const RESOURCE_TYPES: ResourceType[] = ['people', 'films', 'planets', 'species', 'starships', 'vehicles'];

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<{ type: ResourceType, data: SwapiResource }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const performSearch = async () => {
            setLoading(true);
            const allResults: { type: ResourceType, data: SwapiResource }[] = [];

            await Promise.all(RESOURCE_TYPES.map(async (type) => {
                try {
                    const res = await swapiService.fetchFromSwapi<SwapiResource>(type, query);
                    res.results.forEach(item => {
                        allResults.push({ type, data: item });
                    });
                } catch (err) {
                    console.error(`Search failed for ${type}`, err);
                }
            }));

            setResults(allResults);
            setLoading(false);
        };

        performSearch();
    }, [query]);

    return (
        <div className={styles.container}>
            <h1 className="title-sw">Search Results for "{query}"</h1>

            {loading ? (
                <div className={styles.loader}>Scanning the star systems...</div>
            ) : results.length === 0 ? (
                <p className={styles.empty}>No matches found. Try another coordinate.</p>
            ) : (
                <div className={styles.grid}>
                    {results.map((result, idx) => (
                        <Card key={idx} item={result.data} type={result.type} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
