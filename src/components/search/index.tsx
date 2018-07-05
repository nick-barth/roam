// Vendors
import * as React from 'react';

// CSS
import './index.css';

/*****
SEARCH
******/

export default class Spinner extends React.Component<any, any> {

    constructor(props:any) {
        super(props);

        this.state = {
            searchQuery: ''
        };
    }

    // In real life would be a debounce here
    public doSearch(e:any):void {
        e.preventDefault();
        const { searchQuery } = this.state;
        const { setMap } = this.props;

        const url = 'http://api.digitransit.fi/geocoding/v1/search';
        const textParam = '?text=' + searchQuery;
        const sizeParam = '&size=1';
        const query = url + textParam + sizeParam;

        fetch(query)
        .then(response => {
            response.json().then(data => {
                console.log(data.features[0].properties);
                setMap({
                    location: data.features[0].geometry.coordinates,
                    name: data.features[0].properties.name

                });
            })
        });
        
    };


    public render() {
        return (
            <div className="search">
                <form onSubmit={(e) => this.doSearch(e)}>
                    <input type="text" onChange={e => this.setState({searchQuery: e.target.value })}/>
                </form>
            </div>
        );
    }
}