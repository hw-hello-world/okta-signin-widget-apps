(function () {
  var config = {
    "baseUrl": "https://hw.trexcloud.com",
    "clientId": "JFClyRhfHlUy86dijbMc",
    "clientSecret": "VKQXIeuqr3OIuzazBHjDWSlkoqYN-AINQWqm7nSk",
    "redirectUri": "http://localhost:12234/callback"
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
    console.log('do login');
    doLogin();
  });


})();
