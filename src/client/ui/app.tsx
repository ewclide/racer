import React from 'react';
import cn from 'classnames';
import { UIData } from '../context';
import styles from './app.css';

interface ScoresProps {
    money: number;
    distance: number;
}

function Scores({ money, distance }: ScoresProps): React.ReactElement {
    return (
        <div className={styles.scores}>
            <Money value={money} />
            <Distance value={distance} />
        </div>
    );
}

class Money extends React.PureComponent<{ value: number }> {
    render(): React.ReactNode {
        const { value } = this.props;
        return (
            <div className={cn(styles['score-item'], styles.money)}>
                <span>Money:</span> {value}
            </div>
        );
    }
}

class Distance extends React.PureComponent<{ value: number }> {
    render(): React.ReactNode {
        const { value } = this.props;
        return (
            <div className={cn(styles['score-item'], styles.distance)}>
                <span>Distance:</span> {Math.floor(value / 1000)}km {Math.floor(value % 1000)}m
            </div>
        );
    }
}

export function App(props: UIData): React.ReactElement {
    const { money, distance, time } = props;

    return (
        <Scores money={money} distance={distance} />
    );
}
