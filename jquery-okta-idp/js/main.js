/* global OktaSignIn */
/* global baseUrl */
/* global redirectUrl */
/* global $ */

$(function () {

  const LS = localStorage;

  const KEY_OKTA_USER = 'okta-user';

  var okta = window.okta;

  function bindEvents() {
    $('#main').on('click', '#logout', function () {
      LS.removeItem(KEY_OKTA_USER);
      refresh();
    });

  }

  function showUserInfo(user) {

    var email = user.email,
        name = user.name,
        expiresAt = user.expiresAt,
        token = user.token;

    $('#main').html(`<h1>Welcome ${name} </h1>
                    <p>email: ${email}</p>
                    <p>expiresAt: ${expiresAt}</p>
                    <p>token: ${token}</p>
                    <a href="#" id="logout">Logout</a>`
                   );
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
      LS.setItem(KEY_OKTA_USER, JSON.stringify(user));
      refresh();
    } else {
      console.error('Login failed: ', xss);
    }
  }

  function logError() {
    console.error(arguments);
  }

  function showLogin() {
    $('#main').empty();
    okta.si.renderEl({el: '#main'}, loginSuccess, logError);
  }

  function refresh() {
    window.location.reload();
  }

  function checkSession(oktaUser) {
    if (oktaUser) {
      showUserInfo(JSON.parse(oktaUser));
    } else {
      showLogin();
    }
  }

  function loading() {
    $('#main').text('Loading...');
  }

  function main() {
    loading();

    var oktaUser = LS.getItem(KEY_OKTA_USER);
    checkSession(oktaUser);
  }

  bindEvents();
  main();

});
