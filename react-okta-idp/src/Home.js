import React, { Component } from 'react';
import {Link} from 'react-router';



class User extends Component {

  render() {
    return (
        <div>
        <h1>Welcome {this.props.user.name}</h1>
        <label>Email: </label><span>{this.props.user.email}</span>
        </div>
    );
  }

}

class Home extends Component {

  constructor() {
    super();

    var user = localStorage.getItem('okta-user');

    this.state = {user: user ? JSON.parse(user) : null};
  }

  // TODO: get error when login > logout > login
  // from okta-sign-in-entry.js
  logout() {
    localStorage.removeItem('okta-user');
    this.setState({'user': null});
  }

  render() {
    return (
      <div>
        {this.state.user ?
         <div>
         <User user={this.state.user} />
         <a href='#' onClick={this.logout.bind(this)}>Logout</a>
         </div> :
         <Link to="/login">Login</Link> }
      </div>
    );
  }
}

export default Home;
