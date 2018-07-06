// Vendors
import * as React from 'react';

// Components
import Results from './components/results';
import Search from './components/search';

// CSS
import './App.css';

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

  public setMap(pointData: any):void {
    this.setState({ query: pointData });
  };

  public render() {
    const { query } = this.state;

    return (
      <div className="App">
        <Search setMap={(data:any) => this.setMap(data)}/>
          {query.name !== '' ? <Results lat={query.location[1]} lon={query.location[0]} /> : null}
      </div>
    );
  }
}

export default App;
