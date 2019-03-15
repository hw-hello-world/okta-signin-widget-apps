const od = 'https://rain.okta1.com';
const signIn = new OktaSignIn({
  "baseUrl": od,
  "logoText": "Windico",
  "language": "en",
  "features": {
    "securityImage": true,
    "router": true,
    "rememberMe": true,
  },
  "idps": [
    { "id": "aaa", "type": "facebook" },
    { "id": "bbb", "type": "google" }
  ],
  "assets": {
    "baseUrl": "/"
  }
});

const successFn = (resp) => {
  console.log(resp);
  if (resp.session && resp.status === 'SUCCESS') {
    resp.session.setCookieAndRedirect(od);
  }
};

signIn.renderEl(
  {el: '#main'},
  successFn,
);
