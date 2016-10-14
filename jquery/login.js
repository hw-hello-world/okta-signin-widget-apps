/* global $ */

$(function () {
  var si = window.okta.si;

  function success(res) {
    if (res.status === 'SUCCESS') {
      res.session.setCookieAndRedirect('http://localhost:8000/');
    }
  }

  si.renderEl(
    {
      el: '#okta-login-container'
    },
    success
  );

});
