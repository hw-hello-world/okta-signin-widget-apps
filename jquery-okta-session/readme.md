# use case

- None OIDC App
- App doesn't manage its own session but rely on Okta session
- Use Okta SignIn Widget to 
    - authenticate 
    - obtain sessionToken
    - use `sessionRedirect` to exchange sessionToken for seesion cookie (a.k.a finish login)
      see [here for details](https://developer.okta.com/docs/guides/session-cookie/overview/#retrieving-a-session-cookie-by-visiting-a-session-redirect-link)
