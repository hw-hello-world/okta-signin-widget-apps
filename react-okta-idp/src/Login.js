import React, { Component } from 'react';

import Signin from '@okta/okta-signin-widget';

// TODO: import fonts and images

import '../node_modules/@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '../node_modules/@okta/okta-signin-widget/dist/css/okta-theme.css';

class OktaSigninWidget extends Component {

  componentDidMount() {
    this.renderSigninForm();
  }

  // TODO: "soft refresh" page to show login users.
  loginSuccess(xss) {
    if (xss.status === 'SUCCESS') {
      var idTokenObj = xss[0],
          user = {email: idTokenObj.claims.email,
                  name: idTokenObj.claims.name,
                  token: idTokenObj.idToken,
                  expiresAt: idTokenObj.expiresAt
                 };
      console.log(user);
      return user;
    } else {
      console.error('Login failed: ', xss);
      return null;
    }
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
  render() {
    return (
      <div>
        <h1>Here is the fancy Signin Widget</h1>
        <OktaSigninWidget />
      </div>
    );
  }
}

export default Login;
