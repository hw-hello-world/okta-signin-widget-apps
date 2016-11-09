import React, { Component } from 'react';
import {Link} from 'react-router';

// IF login show user name
// ELSE show login link
class App extends Component {
  render() {
    return (
      <div>
      <ul>
        <li><Link to="/login">Login</Link></li>
        </ul>
          <div className="content">
          {this.props.children}
          </div>
        </div>
    );
  }
}

export default App;
