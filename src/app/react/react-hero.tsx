import * as React from 'react';
import Button from '@material-ui/core/Button';

class ReactHero extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span>
                <span>react-hero works!</span>
                <br />
                <span>Don't have any data</span>
                <Button variant="contained" color="primary" onClick={() => {
                    alert('click');
                }}>
                    Hello World
                </Button>
            </span>
        );
    }
}

export default ReactHero;
