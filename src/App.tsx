// Vendors
import * as React from 'react';

// Components
import Results from './components/results';
import Search from './components/search';

export  class App extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props);

    this.state = {
      query: {
        location: ['',''],
        name: ''
      }
    };

  }

  /**
   * Sets map to the point data we were given from the query
   * @param pointData 
   */

  public setMap(pointData: any):void {
    this.setState({ query: pointData });
  };

  public render() {
    const { query } = this.state;

    return (
      <div className="App">
        <div className="title">
          Helsinki Public Transit
        </div>
        <Search setMap={(data:any) => this.setMap(data)} clearSelection={() => this.setState({query: {location: ['',''], name:''}})}/>
          <div className="map-container">
            <div id="mapContainer" />
          </div>
          {query.name !== '' ? <Results lat={query.location[1]} lon={query.location[0]} /> : null}
      </div>
    );
  }
}

export default App;
