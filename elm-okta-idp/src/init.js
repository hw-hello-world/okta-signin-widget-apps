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

function refresh() {
  window.location.reload();
}

function loginSuccess(xss) {
  // TODO: create my own session via localStorage
  if (xss.status === 'SUCCESS') {
    var idTokenObj = xss[0],
        user = {email: idTokenObj.claims.email,
                name: idTokenObj.claims.name,
                token: idTokenObj.idToken,
                expiresAt: idTokenObj.expiresAt
               };
    localStorage.setItem(KEY_OKTA_USER, JSON.stringify(user));
    refresh();
  } else {
    console.error('Login failed: ', xss);
  }
}

function logError() {
  console.error(arguments);
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

app.ports.logout.subscribe(() => {
  logout();
});
