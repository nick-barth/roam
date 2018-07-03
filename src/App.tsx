// Vendors
import * as React from 'react';

// Components
import Spinner from './components/spinner';

// CSS
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Spinner />
      </div>
    );
  }
}

export default App;
