import React from 'react';
import ReactDOM from 'react-dom';
import { Context } from '../context';
import { App } from './app';
// import { EasyUIElement } from '../../easy-ui';
// import styles from './app.css';

export class UI {
    container: HTMLElement;
    // element: EasyUIElement<Scores>;

    constructor() {
        const context = Context.get();

        this.container = document.createElement('div');
        this.container.id = 'ui';
        // this.element = new EasyUIElement<Scores>(this.container, ui);

        context.container.appendChild(this.container);

        this.update();
    }

    update(): void {
        const { uiData } = Context.get();
        ReactDOM.render(<App {...uiData} />, this.container);
        // console.log('redraw UI');
    }
}
