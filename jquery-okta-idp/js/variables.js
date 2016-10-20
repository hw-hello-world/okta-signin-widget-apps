/* global OktaSignIn */

var baseUrl = 'http://rain.okta1.com:1802';
var redirectUri = 'http://localhost:12234';
//baseUrl = 'https://dev-148986.oktapreview.com';

window.okta = {
  redirectUri: redirectUri,
  baseUrl: baseUrl,
  si: new OktaSignIn({
    baseUrl: baseUrl,
    clientId: '6Pze0m2vkSxRSief13K6',
    //redirectUri: 'http://hello.world.io/',
    redirectUri: redirectUri,
    authParams: {
      responseType: ['code'],
      //responseType: ['id_token', 'token'],
      scope: ['openid', 'email', 'profile']
    },
    idpDisplay: 'SECONDARY',
    idps: [
      { 'type': 'FACEBOOK',
        'id': '0oa2pv82w7tSWkjVJ0g4'
      },
      { 'type': 'LINKEDIN',
        'id': '0oa4zxvMKJAERrrtp0g4'
      },
      {
        type: 'GOOGLE',
        id: '0oa50975a41R0mW4U0g4'
      }
    ]
  })
};


baseUrl = 'https://hw.trexcloud.com/';

window.okta = {
  redirectUri: redirectUri,
  baseUrl: baseUrl,
  si: new OktaSignIn({
    baseUrl: baseUrl,
    clientId: 'JFClyRhfHlUy86dijbMc',
    redirectUri: redirectUri,
    authParams: {
      responseType: ['code'],
      //responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    },
    idpDisplay: 'SECONDARY',
    idps: [
      {
        type: 'GOOGLE',
        id: '0oa1rmg3dssXEyR4p0g7'
      },
      {
        type: 'LINKEDIN',
        id: '0oa1rmm6ltTtONUQ30g7'
      }
    ]
  })
};
