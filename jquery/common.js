/* global OktaSignIn */
/* global $ */

$(function () {

  var baseUrl = 'http://rain.okta1.com:1802';

  //baseUrl = 'https://dev-148986.oktapreview.com';

  window.okta = {
    baseUrl: baseUrl,
    si: new OktaSignIn({baseUrl: baseUrl})
  };

});
