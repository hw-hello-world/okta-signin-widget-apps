# Notes

## Okta as IDP with cookie

1. the `setCookieAndRedirect` from signin widget will set session for the auth domain (baseURL)
   - seems `dev tool` -> `Applications` -> `Cookies` only show cookies for current domain thus it's visible but go check `chrome -> settinsg -> all content`
   - [X] why in some sites it does show cookies for multiple domain?? check site http://www.merriam-webster.com/ for example. (if the site loading other sites via iframe)

2. API request to the domain will carry along the session credential (`withCredentials: true` when AJAX request)

3. it really depend on API settings whether or not allow CORS. Currently, OKTA only allow CORS for enduser APIs


# TODO

[TODO.org](./todo.org)
