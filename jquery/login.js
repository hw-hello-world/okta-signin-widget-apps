/* global $ */

$(function () {
  var si = window.okta.si;

  function success(res) {
    if (res.status === 'SUCCESS') {
      res.session.setCookieAndRedirect('http://localhost:12234');
    }
  }

  si.renderEl(
    {
      el: '#okta-login-container'
    },
    success
  );

});
