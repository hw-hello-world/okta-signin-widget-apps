/* global baseUrl */
/* global clientId */
/* global redirectUri */
/* global OktaAuth */

(function () {
  var config = {
    "baseUrl": baseUrl,
    "clientId": clientId,
    "redirectUri": redirectUri
  };

  var oa = new OktaAuth({
    url: config.baseUrl,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    scopes: ['openid', 'email', 'profile']
  });

  function doLogin() {
    oa.token.getWithRedirect({ responseType: 'code' });
  }

  document.getElementById('loginWithOkta').addEventListener('click', function () {
    doLogin();
  });


})();
