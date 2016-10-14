/* global OktaSignIn */
/* global jQuery */

(function ($) {

  // TODO:
  // 1. dynamic insert scripts and stylesheet if OktaSignIn object is not available.
  //

  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Okta-SDK': 'jquery-okta-signin-plugin',
    'X-Okta-User-Agent-Extended': 'jquery-okta-signin-plugin'
  };

  function ajax(options, method, url, data) {
    return $.ajax({
      url: options.baseUrl + url,
      method: method,
      headers: headers,
      data: data || {},
      xhrFields: {
        withCredentials: true
      }
    });
  }


  var api = {
    ajax: ajax,
    me: function (options) {
      return ajax(options, 'GET', '/api/v1/users/me');
    }
  };


  function bindEvents(options) {
    options.el.on('click', '#logout', function () {
      options.si.session.close(refresh);
    });
  }

  function showUserInfo(options, user) {

    var fullName = user.profile.firstName + ' ' + user.profile.lastName,
        login = user.profile.login;

    options.el.html(
      `<span class="okta-fullname">${fullName}</span> /
       <span class="okta-login">${login}</span> /
       <a href="#" id="logout">Logout</a>`);
  }

  function loginSuccess(options, res) {
    if (res.status === 'SUCCESS') {
      res.session.setCookieAndRedirect(options.redirectUrl);
    } else {
      console.error('Login failed: ', res);
    }
  }

  function showLogin(options) {
    options.el.empty();
    options.si.renderEl({el: options.el}, loginSuccess.bind(this, options));
  }

  function refresh() {
    window.location.reload();
  }

  function checkSession(options, session) {
    if (session) {
      api.me(options).then(showUserInfo.bind(this, options));
    } else {
      showLogin(options);
    }
  }


  /**
   *
   * @param {String} options.baseUrl
   * @param {String} options.redirectUrl
   */
  $.fn.oktaSignIn = function (options) {

    return this.each(function () {
      var si = new OktaSignIn({baseUrl: baseUrl}),
          opt = $.extend({}, options, {si: si, el: $(this)});

      bindEvents(opt);

      opt.el.text('Loading...');
      si.session.exists(checkSession.bind(this, opt));
    });
  };

}(jQuery));
