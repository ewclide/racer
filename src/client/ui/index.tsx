import ReactDOM from 'react-dom';
import { AppContextProvider } from './context';
import { GameContext } from '../context';
import { GameStore } from '../store';
import { App } from './app';
import styles from './app.module.css';

export class UI {
    container: HTMLElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'game-ui';
        this.container.className = styles.root;

        const context = GameContext.get();
        context.container.appendChild(this.container);

        console.log(context.store);

        this.create(context.store);
    }

    create(store: GameStore): void {
        ReactDOM.render(
            <AppContextProvider value={store}>
                <App />
            </AppContextProvider>
        , this.container);
    }
}
