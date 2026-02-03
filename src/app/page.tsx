import styles from "./page.module.css";
import Link from 'next/link';

const CATEGORIES = [
  { id: 'people', name: 'Characters' },
  { id: 'films', name: 'Movies'},
  { id: 'planets', name: 'Planets'},
  { id: 'species', name: 'Species'},
  { id: 'starships', name: 'Starships' },
  { id: 'vehicles', name: 'Vehicles'},
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
