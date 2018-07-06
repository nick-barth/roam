// Vendors
import * as React from 'react';

// Components
import Spinner from '../spinner';

// CSS
import './index.css';

/*****
SEARCH
******/

export default class Search extends React.Component<any, any> {

    constructor(props:any) {
        super(props);

        this.state = {
            data: null,
            isLoading: false,
            searchQuery: ''
        };
    }

    /**
     * fire's search, in production would debounce / promise&promise delete if updated - however, lazy
     * @param e - event
     */
    public doSearch(e:any):void {
        e.preventDefault();
        this.setState({isLoading: true});
        const { searchQuery } = this.state;

        const url = 'http://api.digitransit.fi/geocoding/v1/search';
        const textParam = '?text=' + searchQuery;
        const sizeParam = '&size=5';
        const query = url + textParam + sizeParam;

        fetch(query)
        .then(response => {
            response.json().then(data => {
                console.log(data.features);
                this.setState({
                    isLoading:false,
                    results: data.features
                });
            })
        });
        
    };


    public render() {
        const { results, isLoading } = this.state;

        return (
            <div className="search">
                <form onSubmit={(e) => this.doSearch(e)}>
                    <input type="text" onChange={e => this.setState({searchQuery: e.target.value })}/>
                </form>
                {results && results[0] ? (
                    <React.Fragment>
                        <div className="search__results">
                            Search Results, please choose correct one
                        </div>
                        {results.map((result:any) => {
                            console.log(result.properties);
                            const { name, id } = result.properties;
                            return (
                                <div onClick={() => this.props.setMap({ location: result.geometry.coordinates, name})} key={id}>
                                    {name}
                                </div>
                            )
                        })}
                    </React.Fragment>
                ) : isLoading ? (<Spinner />) : null}
            </div>
        );
    }
}