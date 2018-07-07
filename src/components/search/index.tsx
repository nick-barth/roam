// Vendors
import * as React from 'react';

// Components
import Spinner from '../spinner';

// CSS
import './index.css';

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
     * doSearch - fires search, in production would debounce / promise&promise delete if updated - however, lazy
     * @param e - event
     */
    public doSearch(e:any): void {
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
                this.setState({
                    isLoading:false,
                    results: data.features
                });
            })
        });
        
    };

    /**
     * Bubbles that bad boy location up & hides results
     * @param loc - name and location of selected result
     */

    public selectLocation(loc:object): void {
        this.props.setMap(loc);
        this.setState({
            results: []
        });
    }


    public render() {
        const { results, isLoading } = this.state;

        return (
            <div className="search">
                <form onSubmit={(e) => this.doSearch(e)}>
                    <input type="text" className="search-bar" onChange={e => this.setState({searchQuery: e.target.value })}/>
                </form>
                {results && results[0] ? (
                    <div className="search-results">
                        {results.map((result:any) => {
                            const { name, id } = result.properties;
                            return (
                                <div className="search-result" onClick={() => this.selectLocation({ location: result.geometry.coordinates, name})} key={id}>
                                    {name}
                                </div>
                            )
                        })}
                    </div>
                ) : isLoading ? (<Spinner />) : null}
            </div>
        );
    }
}