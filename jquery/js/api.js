/* global OktaSignIn */
/* global baseUrl */
/* global redirectUrl */
/* global $ */


var okta = window.okta = {
  redirectUrl: redirectUrl,
  baseUrl: baseUrl,
  si: new OktaSignIn({baseUrl: baseUrl})
};

(function () {

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
