/* global OktaSignIn */
/* global baseUrl */
/* global redirectUrl */
/* global $ */

$(function () {

  var okta = window.okta;

  function bindEvents() {
    $('#main').on('click', '#logout', function () {
      okta.si.session.close(refresh);
    });

  }

  function showUserInfo(user) {

    var fullName = user.profile.firstName + ' ' + user.profile.lastName,
        login = user.profile.login,
        status = user.status,
        id = user.id;

    $('#main').html(`<h1>Welcome ${fullName} </h1>
                    <p>${login}</p>
                    <p>${status}</p>
                    <p>${id}</p>
                    <a href="#" id="logout">Logout</a>`
                   );
  }

  function loginSuccess(res) {
    if (res.status === 'SUCCESS') {
      res.session.setCookieAndRedirect(okta.redirectUrl);
    } else {
      console.error('Login failed: ', res);
    }
  }

  function showLogin() {
    $('#main').empty();
    okta.si.renderEl({el: '#main'}, loginSuccess);
  }

  function refresh() {
    window.location.reload();
  }

  function checkSession(session) {
    if (session) {
      okta.api.user.me().then(showUserInfo);
    } else {
      showLogin();
    }
  }

  function loading() {
    $('#main').text('Loading...');
  }

  function main() {
    loading();
    okta.si.session.exists(checkSession);
  }

  bindEvents();
  main();

});
