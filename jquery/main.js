/* global $ */

$(function () {
  var okta = window.okta;


  function bindEvents() {
    $('#main').on('click', '#logout', function () {
      okta.si.session.close(refresh);
    });

  }

  function showUserInfo(user) {

    $('#main').append('<h2>Welcome ' + user.profile.firstName + ' ' + user.profile.lastName + '</h2>' +
                      '<p>' + user.profile.login + '</p>' +
                      '<p>' + user.status + '</p>' +
                      '<p>' + user.id + '</p>' +
                      '<a href="#" id="logout">Logout</a>'
                     );

    okta.api.user.tabs();
  }

  function showLoginLink() {
    $('body').prepend('<a id="login" href="/login.html">Login</a>');
  }

  function refresh() {
    window.location.reload();
  }

  function checkSession(session) {
    if (session && session.status === 'ACTIVE') {
      okta.api.user.me().then(showUserInfo);
    } else {
      showLoginLink();
    }
  }

  function loading() {
    $('#main').text('Loading...');
  }

  function main() {
    loading();
    okta.si.session.get(checkSession);
  }

  bindEvents();
  main();

});
