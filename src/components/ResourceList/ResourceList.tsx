'use client';

import { useState, useEffect } from 'react';
import { swapiService } from '@/services/api';
import { SwapiResource, ResourceType } from '@/types';
import Card from '@/components/Card/Card';
import styles from './ResourceList.module.css';

interface ResourceListPageProps {
    type: ResourceType;
    title: string;
}

export default function ResourceListPage({ type, title }: ResourceListPageProps) {
    const [data, setData] = useState<{ results: SwapiResource[], count: number }>({ results: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await swapiService.fetchFromSwapi<SwapiResource>(type, search, page);
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [type, page, search]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="title-sw">{title}</h1>
                <div className={styles.controls}>
                    <input
                        type="text"
                        placeholder={`Filter ${title.toLowerCase()}...`}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className={styles.filterInput}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading...</div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {data.results.map((item, idx) => (
                            <Card key={item.url || idx} item={item} type={type} />
                        ))}
                    </div>

                    <div className={styles.pagination}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className={styles.pageBtn}
                        >
                            Previous
                        </button>
                        <span className={styles.pageInfo}>Page {page} of {Math.ceil(data.count / 10)}</span>
                        <button
                            disabled={page >= Math.ceil(data.count / 10)}
                            onClick={() => setPage(p => p + 1)}
                            className={styles.pageBtn}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
