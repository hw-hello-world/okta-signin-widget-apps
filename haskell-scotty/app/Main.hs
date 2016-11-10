{-# LANGUAGE OverloadedStrings #-}

module Main where

import Web.Scotty
import Text.Blaze.Html5 ((!), label)
import qualified Text.Blaze.Html5 as H
import qualified Text.Blaze.Html5.Attributes as H
import Text.Blaze.Html.Renderer.Text (renderHtml)
import Network.Wai.Middleware.RequestLogger
import Network.Wai.Middleware.Static
import Data.String

-- import Lib

main :: IO ()
main = scotty 12234 $ do
  middleware logStdoutDev
  middleware $ staticPolicy (noDots >-> addBase "public")
  get "/" $ html . renderHtml $ H.html $ do
    H.h1 "Demo - Okta Signin Widget"
    H.a ! H.href "/login" $ "Login"
  get "/login" $ html . renderHtml $ loginPage
  get "/callback" $ do
    code <- param "code"
    state <- param "state"
    html "abc"

test = html . renderHtml $ H.html $ do
      H.h1 "TODO: Got code and need to exchange access token"
      H.p $ do
        label "code"
        label code
      H.p $ do
        label "state"
        label state


oktaSignInBase :: String
oktaSignInBase = "https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.8.0"

oktaAuth = "https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.5.0"
oktaAuthJs = fromString (oktaAuth ++ "/OktaAuth.min.js")

oktaSignInJs, oktaSignInCss, oktaSignInTheme :: H.AttributeValue
oktaSignInJs = fromString (oktaSignInBase ++ "/js/okta-sign-in.min.js")
oktaSignInCss = fromString $ oktaSignInBase ++ "/css/okta-sign-in.min.css"
oktaSignInTheme = fromString $ oktaSignInBase ++ "/css/okta-theme.css"

loginPage :: H.Html
loginPage = H.html $ do
  H.head $ do
    --css oktaSignInCss
    --css oktaSignInTheme
    --js oktaSignInJs
    js oktaAuthJs
    css "/css/main.css"
  H.h1 "Okta Login!"
  H.p $ H.a ! H.href "#" ! H.id "loginWithOkta" $ "Login with Okta"
  -- H.div ! H.id "okta-sign-in-container" $ ""
  H.p $ H.a ! H.href "/" $ "Back to home"
  js "/js/login.js"

css :: H.AttributeValue -> H.Html
css l = H.link ! H.href l ! H.rel "stylesheet" ! H.type_ "text/css"

js :: H.AttributeValue -> H.Html
js l = H.script ! H.src l ! H.type_ "text/javascript" $ ""
