{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}


module Main where

import Data.Aeson (decode)
import           Data.Aeson.TH                 (defaultOptions, deriveJSON)

import qualified Data.ByteString.Lazy.Char8 as BS
import Data.Text (Text)
import Web.Scotty
import Text.Blaze.Html5 ((!), label)
import qualified Text.Blaze.Html5 as H
import qualified Text.Blaze.Html5.Attributes as H
import Text.Blaze.Html.Renderer.Text (renderHtml)
import Network.Wai.Middleware.RequestLogger
import Network.Wai.Middleware.Static
import Data.String

-- import Lib

------------------------------
-- Config Data
------------------------------

data Config = Config { baseUrl :: String
                     , clientId :: String
                     , clientSecret :: String
                     , redirectUri :: String
                     } deriving (Show)

$(deriveJSON defaultOptions ''Config)

-- FIXME: include config.json in build result
--
configFile :: String
configFile = "/Users/haisheng.wu/hw-hello-world/okta-signin-widget/haskell-scotty/app/config.json"

------------------------------
-- App
------------------------------

main :: IO ()
main = do
  cf <- BS.readFile configFile
  case decode cf of
    Nothing -> error "Can not read config file"
    Just c -> app c

-- FIXME: session
--
app :: Config -> IO ()
app c = scotty 12234 $ do
  middleware logStdoutDev
  middleware $ staticPolicy (noDots >-> addBase "public")
  get "/" $ html . renderHtml $ homePage
  get "/login-okta" $ html . renderHtml $ loginOktaPage c
  get "/logout" $ text "FIXME: logout"
  get "/callback" $ do
    code <- param "code"
    state <- param "state"
    html . renderHtml $ callbackPage code state


oktaSignInBase :: String
oktaSignInBase = "https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.8.0"

oktaAuth :: String
oktaAuth = "https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.5.0"

oktaAuthJs :: H.AttributeValue
oktaAuthJs = fromString (oktaAuth ++ "/OktaAuth.min.js")

oktaSignInJs, oktaSignInCss, oktaSignInTheme :: H.AttributeValue
oktaSignInJs = fromString (oktaSignInBase ++ "/js/okta-sign-in.min.js")
oktaSignInCss = fromString $ oktaSignInBase ++ "/css/okta-sign-in.min.css"
oktaSignInTheme = fromString $ oktaSignInBase ++ "/css/okta-theme.css"

homePage :: H.Html
homePage = H.html $ do
    H.head $ css "/css/main.css"
    H.h1 "Demo - Okta Signin Widget"
    H.ul $ do
      H.li $ H.a ! H.href "/login-okta" $ "Login Okta"
      H.li $ H.a ! H.href "/login-custom" $ "Login Custom"

    --css oktaSignInCss
    --css oktaSignInTheme
    --js oktaSignInJs

loginOktaPage :: Config -> H.Html
loginOktaPage c = H.html $ do
  H.head $ do
    js oktaAuthJs
    css "/css/main.css"
  H.h1 "Okta Login!"
  H.p $ H.a ! H.href "#" ! H.id "loginWithOkta" $ "Login with Okta"
  -- H.div ! H.id "okta-sign-in-container" $ ""
  H.p $ H.a ! H.href "/" $ "Back to home"
  H.script ! H.type_ "text/javascript" $ H.toHtml $
    unlines [ "var baseUrl = '" ++ baseUrl c ++ "';"
            , "var clientId = '" ++ clientId c ++ "';"
            , "var redirectUri = '" ++ redirectUri c ++ "';"
            ]
  js "/js/login.js"

callbackPage :: Text -> Text -> H.Html
callbackPage code state = H.html $ do
  H.h1 "TODO: Got code and need to exchange access token"
  H.p $ do
    label "code: "
    label $ H.toHtml code
  H.p $ do
    label "state: "
    label $ H.toHtml state

css :: H.AttributeValue -> H.Html
css l = H.link ! H.href l ! H.rel "stylesheet" ! H.type_ "text/css"

js :: H.AttributeValue -> H.Html
js l = H.script ! H.src l ! H.type_ "text/javascript" $ ""
