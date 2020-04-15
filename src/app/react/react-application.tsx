import { Injector } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactHero from './react-hero';

interface IReactApplication {
    injector: Injector;
}

class ReactApp extends React.Component<IReactApplication, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'renderer'}>
                <h2>ReactJS component: </h2>
                <br />
                <ReactHero />
            </div>
        );
    }
}

export class ReactApplication {
    static initialize(containerId: string, injector: Injector) {
        ReactDOM.render(<ReactApp injector={injector} />, document.getElementById(containerId));
    }
}
