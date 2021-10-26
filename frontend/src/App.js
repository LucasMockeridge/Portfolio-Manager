import React from 'react';
import './App.module.css';
import { Navbar, Home, Portfolio, Watchlist, Holding, Results, Quote } from './components'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/portfolio">
                    <Portfolio />
                </Route>
                <Route exact path="/watchlist">
                    <Watchlist />
                </Route>
                <Route path = '/holding/:name'>
                    <Holding />
                </Route>
                <Route path = '/quote/:name'>
                    <Quote />
                </Route>
                <Route path = '/search'>
                    <Results />
                </Route>
                <Route path="*">
                    <h1>404</h1>
                </Route>
            </Switch>
        </Router>
  );
}

export default App;
