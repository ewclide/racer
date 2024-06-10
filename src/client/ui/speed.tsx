import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useAppContext } from './context';
import styles from './app.module.css';

export const Speed = observer(() => {
    const { speed } = useAppContext();

    return (
        <div className={cn(styles['score-item'], styles.money)}>
            <span>Speed:</span> {speed}km/h
        </div>
    );
})