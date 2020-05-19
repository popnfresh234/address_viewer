import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map.jsx';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <Map />
    );
  }
}

ReactDOM.render( <App />, document.getElementById( 'root' ) );
