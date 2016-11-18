/* global OktaSignIn */

var Elm = require('./Main2.elm');

var baseUrl = 'https://hw.trexcloud.com/';
var redirectUri = 'http://localhost:12234/';

var okta = window.okta = {
  redirectUri: redirectUri,
  baseUrl: baseUrl,
  si: new OktaSignIn({
    baseUrl: baseUrl,
    clientId: 'JFClyRhfHlUy86dijbMc',
    redirectUri: redirectUri,
    authParams: {
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    }
  })
};

function loginSuccess(xss) {
  var portResponse = {};

  if (xss.status === 'SUCCESS') {
    var idTokenObj = xss[0],
        user = {email: idTokenObj.claims.email,
                name: idTokenObj.claims.name,
                token: idTokenObj.idToken,
                expiresAt: idTokenObj.expiresAt
               };
    portResponse = {
      profile: user,
      error: ""
    };

  } else {
    portResponse = {
      profile: undefined,
      error: JSON.stringify(arguments)
    };
  }

  app.ports.loginResult.send(portResponse);
}

function logError() {
  app.ports.loginResult.send({
    profile: undefined,
    error: JSON.stringify(arguments)
  });
}

function login() {
  okta.si.renderEl({el: '#main'}, loginSuccess, logError);
}

var app = Elm.ElmMain.fullscreen();

app.ports.login.subscribe(() => {
  login();
});
