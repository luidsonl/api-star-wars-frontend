import styles from "./page.module.css";
import Link from 'next/link';

const CATEGORIES = [
  { id: 'people', name: 'Characters', image: 'https://images.unsplash.com/photo-1546561892-65bf811416b9?auto=format&fit=crop&q=80&w=400' },
  { id: 'films', name: 'Movies', image: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&q=80&w=400' },
  { id: 'planets', name: 'Planets', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=400' },
  { id: 'species', name: 'Species', image: 'https://images.unsplash.com/photo-1608319917470-9d9179430f8d?auto=format&fit=crop&q=80&w=400' },
  { id: 'starships', name: 'Starships', image: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?auto=format&fit=crop&q=80&w=400' },
  { id: 'vehicles', name: 'Vehicles', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b477?auto=format&fit=crop&q=80&w=400' },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className="title-sw">May the force be with you</h1>
        <p>Explore the ultimate database of the Star Wars universe.</p>
      </header>

      <section className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`/${cat.id}`} className={`${styles.categoryCard} glass`}>
            <div
              className={styles.bgImage}
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className={styles.overlay}>
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
