import { Money } from './money';
import { Distance } from './distance';
import styles from './app.module.css';
import { Speed } from './speed';

export function App() {
    return (
        <div className={styles['top-panel']}>
            <div className={styles.scores}>
                <Speed />
            </div>
            <div className={styles.scores}>
                <Money />
                <Distance />
            </div>
        </div>
    );
}
