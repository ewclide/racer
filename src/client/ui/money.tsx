import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useAppContext } from './context';
import styles from './app.module.css';

export const Money = observer(() => {
    const { money } = useAppContext();

    return (
        <div className={cn(styles['score-item'], styles.money)}>
            <span>Money:</span> {money}
        </div>
    );
});