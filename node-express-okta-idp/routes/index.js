var express = require('express');
var router = express.Router();

var api = require('./api'),
    config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json')) || {},
    redirectUri = config.redirectUri;

router.get('/', (req, res) => {

  var opt = {};

  // TODO: is it secure to public id token??
  // TODO: what is okta-oauth-redirect-params in the cookie?
  if (req.cookies.token) {
    api.getUserName(req.cookies.token, function (userName) {
      opt = {title: `Welcome ${userName}`, isLogin: true};
      res.render('index', opt);
    });
  } else {
    res.render('index', {title: 'Hello Okta Signin Widget', isLogin: false});
  }

});

router.get('/login', (req, res) => {
  // redirect to home if already login otherwise show login form

  if (req.cookies.token) {
    res.redirect('/');
  }

  res.render('login', {
    title: 'Hello Okta Signin',
    baseUrl: config.baseUrl,
    redirectUri: redirectUri,
    clientId: config.clientId
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/callback', (req, res) => {

  api.fetchToken(req, function (idToken) {
    res.cookie('token', idToken);
    res.redirect('/');
  });

});

module.exports = router;
