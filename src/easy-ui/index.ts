/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-use-before-define */

// type SimpleType = string | number | boolean;
// type ElementState = { [key: string]: SimpleType | Array<SimpleType> | ElementState };
type EventHandler<T> = (e: Event, t: EventHandler<T>) => void;
type ClassNameComposer<T> = (s: T) => string | Array<string>;
type StrNumComposer<T> = (s: T) => string | number;
type BooleanComposer<T> = (s: T) => boolean;
type NodeComposer<T> = (s: T) => Array<EeasyUISource<T>>

export interface EeasyUISource<T> {
    id?: string;
    tag?: string;
    type?: string;
    name?: string;
    value?: string | number | StrNumComposer<T>;
    checked?: boolean | BooleanComposer<T>;
    text?: string | StrNumComposer<T>;
    html?: string | StrNumComposer<T>;
    state?: T;
    className?: string | Array<string> | ClassNameComposer<T>;
    attrs?: { [key: string]: string };
    style?: { [key: string]: string };
    nodes?: Array<EeasyUISource<T>> | NodeComposer<T>;
    events?: { [key: string]: EventHandler<T> };
}

const getElementId = (() => {
    let id = 0;
    return (): string => `element_${id++}`;
})();

export class EasyUIElement<T extends {} = {}> {
    id: string;
    element: HTMLElement | Text;
    nodes: Array<EasyUIElement<T>>;
    parent: EasyUIElement<T> | null;
    nodesByIds: Map<string, EasyUIElement<T>>;
    state: T;

    private _updaters: Array<() => void>;

    constructor(target: HTMLElement | string, json: EeasyUISource<T>, parent: EasyUIElement<T> | null = null) {
        const { tag = 'div', id = getElementId(), state = {} } = json;

        this.id = id;
        this.parent = parent;
        this.nodes = [];
        this._updaters = [];

        if (tag === 'text') {
            this.element = document.createTextNode('');
        } else {
            this.element = document.createElement(tag);
        }

        if (typeof target === 'string') {
            const targetElement = document.querySelector(target);
            if (targetElement === null) {
                throw new Error(`Can't append element to '${target}'`);
            }
            targetElement.appendChild(this.element);
        } else {
            target.appendChild(this.element);
        }

        if (parent !== null) {
            this.state = parent.state;
            this.nodesByIds = parent.nodesByIds;
        } else {
            //@ts-expect-error
            this.state = state;
            this.nodesByIds = new Map<string, EasyUIElement<T>>();
        }

        this._create(json);
    }

    private _create(json: EeasyUISource<T>): void {
        const { element, nodesByIds } = this;
        const { name, text, html, value, checked, type, attrs, style, nodes, events, className } = json;

        if (element instanceof Text) {
            if (typeof text === 'function') {
                this._updaters.push(() => {
                    element.textContent = String(text(this.state));
                });
            } else {
                element.textContent = text || '';
            }

            return;
        }

        if (text !== undefined) {
            if (typeof text === 'function') {
                this._updaters.push(() => {
                    element.innerText = String(text(this.state));
                });
            } else {
                element.innerText = text || '';
            }
        }

        if (html !== undefined) {
            if (typeof html === 'function') {
                this._updaters.push(() => {
                    element.innerHTML = String(html(this.state));
                });
            } else {
                element.innerHTML = html;
            }
        }

        if (element instanceof HTMLInputElement) {
            if (value !== undefined) {
                if (typeof value === 'function') {
                    this._updaters.push(() => {
                        element.value = String(value(this.state));
                    });
                } else {
                    element.value = String(value);
                }
            }

            if (checked !== undefined) {
                if (typeof checked === 'function') {
                    this._updaters.push(() => {
                        element.checked = checked(this.state);
                    });
                } else {
                    element.checked = checked;
                }
            }

            if (type !== undefined) {
                element.type = type;
            }

            if (name !== undefined) {
                element.name = name;
            }
        }

        if (className !== undefined) {
            if (typeof className === 'function') {
                this._updaters.push(() => {
                    const clnames = className(this.state);
                    element.classList.value = '';
                    if (typeof clnames === 'string') {
                        element.classList.add(clnames);
                    } else {
                        clnames.forEach(cn => element.classList.add(cn));
                    }
                });
            } else if (typeof className === 'string') {
                element.classList.add(className);
            } else if (Array.isArray(className)) {
                className.forEach(cn => element.classList.add(cn));
            }
        }

        if (attrs !== undefined) {
            Object.keys(attrs).forEach((attr) => {
                element.setAttribute(attr, attrs[attr]);
            });
        }

        if (style !== undefined) {
            Object.keys(style).forEach((stl) => {
                Object.assign(element.style, stl, { value: style[stl] });
            });
        }

        if (events !== undefined) {
            Object.keys(events).forEach((event) => {
                // save handlers for destroy
                element.addEventListener(event, (e: Event) => {
                    // events[event](e, this);
                });
            });
        }

        if (nodes !== undefined) {
            if (typeof nodes === 'function') {

            } else {
                this.nodes = nodes.map(node => new EasyUIElement(element, node, this));
            }
        }

        if (nodesByIds.has(this.id)) {
            throw new Error(`Element with id ${this.id} is already exists`);
        }

        nodesByIds.set(this.id, this);
    }

    get(id: string): EasyUIElement<T> {
        const element = this.nodesByIds.get(id);
        if (element === undefined) {
            throw new Error(`Can't get element with id ${id}`);
        }

        return element;
    }
}
