import React, { Component } from 'react';
import {browserHistory} from 'react-router';

import Signin from '@okta/okta-signin-widget';

// TODO: import fonts and images

import '../node_modules/@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '../node_modules/@okta/okta-signin-widget/dist/css/okta-theme.css';

class OktaSigninWidget extends Component {

  componentDidMount() {
    this.renderSigninForm();
  }

  loginSuccess(xss) {
    var user;

    if (xss.status === 'SUCCESS') {
      var idTokenObj = xss[0];
      user = {email: idTokenObj.claims.email,
              name: idTokenObj.claims.name,
              token: idTokenObj.idToken,
              expiresAt: idTokenObj.expiresAt
             };
    } else {
      console.error('Login failed: ', xss);
    }

    this.props.loginCallback(user);

  }

  renderSigninForm() {
    let si = new Signin({
      baseUrl: 'https://hw.trexcloud.com/',
      redirectUri: 'http://localhost:12234/',
      clientId: 'JFClyRhfHlUy86dijbMc',
      authParams: {
        responseType: ['id_token', 'token'],
        scopes: ['openid', 'email', 'profile']
      }
    });
    si.renderEl({el: '#signin-widget-container'}, this.loginSuccess.bind(this));
  }

  render() {
    return (
        <div id="signin-widget-container">
        </div>
    );
  }
}

class Login extends Component {

  loginCallback(user) {
    if (user) {
      console.log(user);
      localStorage.setItem('okta-user', JSON.stringify(user));
      browserHistory.push('/');
    }
  }

  render() {
    return (
        <div>
        <h1>Here is the fancy Signin Widget</h1>
        <OktaSigninWidget loginCallback={this.loginCallback.bind(this)} />
        </div>
    );
  }
}

export default Login;
