/* global OktaSignIn */

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

const KEY_OKTA_USER = 'okta-user';

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

function logout() {
  localStorage.removeItem(KEY_OKTA_USER);
}

var oktaUser = localStorage.getItem(KEY_OKTA_USER);

if (oktaUser) {
  oktaUser = JSON.parse(oktaUser);
}

var app = Elm.ElmMain.fullscreen({loginUser: oktaUser});

app.ports.login.subscribe(() => {
  login();
});
