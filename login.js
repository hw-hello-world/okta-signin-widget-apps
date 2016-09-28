/* global OktaSignIn */

var baseUrl = 'http://rain.okta1.com:1802/';
baseUrl = 'https://dev-148986.oktapreview.com';

var oktaSignIn = new OktaSignIn({baseUrl: baseUrl});

function success(res) {
  if (res.status === 'SUCCESS') {
    res.session.setCookieAndRedirect('http://localhost:8000/');
  }
}

oktaSignIn.renderEl(
  {
    el: '#okta-login-container'
  },
  success
);
