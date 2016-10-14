/* global OktaSignIn */

var baseUrl = 'http://rain.okta1.com:1802';
var redirectUri = 'http://localhost:12234';

//baseUrl = 'https://dev-148986.oktapreview.com';

window.okta = {
  redirectUri: redirectUri,
  baseUrl: baseUrl,
  si: new OktaSignIn({baseUrl: baseUrl})
};
