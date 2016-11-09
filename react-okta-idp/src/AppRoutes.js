import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Home from './Home';
import App from './App';
import Login from './Login';


module.exports = (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
    </Route>
);
