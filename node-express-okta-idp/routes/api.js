var request = require('request'),
    config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json')) || {},
    base64Cred = function(id, secret) {
      var str = new Buffer(`${id}:${secret}`).toString('base64');
      return `Basic ${str}`;
    },
    authHeader = base64Cred(config.clientId, config.clientSecret);

require('request-debug')(request);

function _req(url, formParam, callback) {

  var opt = {
    url: config.baseUrl + url,
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'X-Okta-SDK': 'node-express-okta-idp',
      'X-Okta-User-Agent-Extended': 'node-express-okta-idp'
    },
    method: 'POST',
    form: formParam
  };
  request(opt, callback);
}


var redirectUri = config.redirectUri;


function fetchToken(req, callback) {
  var code = req.query.code,
      state = req.query.state,
      form = {
        'grant_type': 'authorization_code',
        'code': code,
        'state': state,
        'redirect_uri': redirectUri
      };

  _req('/oauth2/v1/token', form, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      callback(info.id_token);
    } else {
      throw new Error(error);
    }
  });
}


function getUserName(token, callback) {
  _req('/oauth2/v1/introspect', {'token': token}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      callback(info.username);
    } else {
      throw new Error(error);
    }
  });
}

module.exports = {
  fetchToken: fetchToken,
  getUserName: getUserName
};
