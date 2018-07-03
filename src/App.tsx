// Vendors
import * as React from 'react';

// Components
import Search from './components/search';

// CSS
import './App.css';

export  class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = {
      query: String
    };

  }


  public render() {
    return (
      <div className="App">
        <Search />
      </div>
    );
  }
}

export default App;
