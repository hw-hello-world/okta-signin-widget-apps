var express = require('express');
var router = express.Router();
//var request = require('request');
var api = require('./api');

//require('request-debug')(request);

/*
var base64Cred = function(id, secret) {
  var str = new Buffer(`${id}:${secret}`).toString('base64');
  return `Basic ${str}`;
};
*/

var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json')) || {},
    //authHeader = base64Cred(config.clientId, config.clientSecret),
    redirectUri = config.redirectUri;



/*
function fetchToken(req, callback) {
  var code = req.query.code,
      state = req.query.state;

  var opt = {
    url: config.baseUrl + '/oauth2/v1/token',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'X-Okta-SDK': 'node-express-okta-idp',
      'X-Okta-User-Agent-Extended': 'node-express-okta-idp'
    },
    method: 'POST',
    form: {
      'grant_type': 'authorization_code',
      'code': code,
      'state': state,
      'redirect_uri': redirectUri
    }
  };
  request(opt, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      callback(info.id_token);
    } else {
      throw new Error(error);
    }
  });
}

function getUserName(token, callback) {
  var opt = {
    url: config.baseUrl + '/oauth2/v1/introspect',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'X-Okta-SDK': 'node-express-okta-idp',
      'X-Okta-User-Agent-Extended': 'node-express-okta-idp'
    },
    method: 'POST',
    form: {
      'token': token
    }
  };
  request(opt, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      callback(info.username);
    } else {
      throw new Error(error);
    }
  });
}
*/

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
