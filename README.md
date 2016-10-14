# Notes

## Session as Credentials

1. the `setCookieAndRedirect` from signin widget will set session for the auth domain (baseURL)
2. API request to the domain will carry along the session as credential (`withCredentials: true`, api.js, line 24)
3. it really depend on API settings whether or not allow CORS. Currently, OKTA only allow CORS for enduser APIs
