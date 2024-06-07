import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import styles from './app.module.css';
import { useAppContext } from './context';

const Money = observer(() => {
    const { money } = useAppContext();

    return (
        <div className={cn(styles['score-item'], styles.money)}>
            <span>Money:</span> {money}
        </div>
    );
});

const Distance = observer(() => {
    const { distance_km, distance_m } = useAppContext();

    return (
        <div className={cn(styles['score-item'], styles.distance)}>
            <span>Distance:</span> {distance_km}km {distance_m}m
        </div>
    );
});

export function App() {
    return (
        <div className={styles.scores}>
            <Money />
            <Distance />
        </div>
    );
}
