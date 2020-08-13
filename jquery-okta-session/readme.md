# use case

- None OIDC App
- App doesn't manage its own session but rely on Okta session
- Use Okta SignIn Widget to 
    - authenticate 
    - obtain sessionToken
    - use `sessionRedirect` to exchange sessionToken for seesion cookie (a.k.a finish login)
