import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Star Wars API Explorer</p>
            </footer>
        </div>
    );
}
