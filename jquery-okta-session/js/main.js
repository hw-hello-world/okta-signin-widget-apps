/* global OktaSignIn */
/* global baseUrl */
/* global redirectUrl */
/* global $ */

(function () {

  var okta = window.okta;

  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Okta-SDK': 'hw-hello-world-jquery',
    'X-Okta-User-Agent-Extended': 'hw-hello-world-jquery'
  };

  function ajax(method, url, data) {
    return $.ajax({
      url: okta.baseUrl + url,
      method: method,
      headers: headers,
      data: data || {},
      xhrFields: {
        // <<<
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
        // <<<
        withCredentials: true
      }
    });
  }


  var api = {
    ajax: ajax,
    user: {
      me: function () {
        return ajax('GET', '/api/v1/users/me');
      },
      tabs: function () {
        return ajax('GET', '/api/v1/users/me/home/tabs');
      }
    }
  };

  window.okta.api = api;

})();

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
      res.session.setCookieAndRedirect(okta.redirectUri);
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
