import React from 'react';
import './App.module.css';
import { Navbar, Home, Portfolio, Watchlist, Holding, Results, Quote } from './components'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useGlobalContext } from './context'
const App = () => {
	const { user } = useGlobalContext();
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/portfolio">
                    {user && <Portfolio />}
                </Route>
                <Route exact path="/watchlist">
                    {user && <Watchlist />}
                </Route>
                <Route path = '/holding/:name'>
                    {user && <Holding />}
                </Route>
                <Route path = '/quote/:name'>
                    {user && <Quote />}
                </Route>
                <Route path = '/search'>
                    {user && <Results />}
                </Route>
                <Route path="*">
                    <h1>404</h1>
                </Route>
            </Switch>
        </Router>
  );
}

export default App;
