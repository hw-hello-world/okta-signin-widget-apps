import React from 'react';
import {Route} from 'react-router';

import App from './App';
import Login from './Login';


module.exports = (
    <Route path="/" component={App}>
      <Route path="/login" component={Login}/>
    </Route>
);
