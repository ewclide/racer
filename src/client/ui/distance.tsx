import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useAppContext } from './context';
import styles from './app.module.css';

export const Distance = observer(() => {
    const { distance_km, distance_m } = useAppContext();

    return (
        <div className={cn(styles['score-item'], styles.distance)}>
            <span>Distance:</span> {distance_km}km {distance_m}m
        </div>
    );
});