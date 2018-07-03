// Vendors
import * as React from 'react';

// CSS
import './index.css';

/******
SPINNER
*******/

export default class Spinner extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="spinner">
                <div className="rect1" />
                <div className="rect2" />
                <div className="rect3" />
                <div className="rect4" />
                <div className="rect5" />
            </div>
        );
    }
}