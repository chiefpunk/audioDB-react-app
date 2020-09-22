import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Artists from './Components/Artists';
import Albums from './Components/Albums';
import NoMatch from './Components/NoMatch';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Artists} />
          <Route exact path="/albums/:artistName" component={Albums} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
