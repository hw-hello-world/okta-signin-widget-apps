{-# LANGUAGE OverloadedStrings #-}


module Main where

import           Control.Arrow                        (second)
import           Control.Monad.IO.Class               (liftIO)
import           Data.Aeson                           (FromJSON, decode,
                                                       parseJSON)
import           Data.Aeson.TH                        (defaultOptions,
                                                       deriveJSON)
import           Data.Aeson.Types
import qualified Data.ByteString.Base64.Lazy          as B64
import           Data.ByteString.Lazy                 (ByteString)
import           Data.List
import           Data.Monoid                          (mempty)
import           Network.HTTP.Types.Status

import qualified Data.ByteString.Lazy.Char8           as BS
import           Network.HTTP.Simple
import           Network.HTTP.Types.Header

import           Data.String
import           Data.Text                            (Text)
import qualified Data.Text                            as T
import qualified Data.Text.Encoding                   as T
import           Network.Wai.Middleware.RequestLogger
import           Network.Wai.Middleware.Static
import           Text.Blaze.Html.Renderer.Text        (renderHtml)
import           Text.Blaze.Html5                     (label, (!))
import qualified Text.Blaze.Html5                     as H
import qualified Text.Blaze.Html5.Attributes          as H
import           Web.Cookie
import           Web.Scotty

import           Config
import           Sessions
import           Types

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
  get "/" $ do
    cookies <- getCookies'
    liftIO $ print cookies
    html . renderHtml $ homePage (findUserFromCookies cookies)
  get "/login-okta" $ html . renderHtml $ loginOktaPage c
  get "/logout" $ text "FIXME: logout"
  get "/callback" $ do
    -- FIXME: code may not exists when the request error and it will contain
    --        error=access_denied&error_description=User+is+not+assigned+to+the+client+application
    --        turns out it is an issue at local server !!???
    code <- param "code"
    state <- param "state"
    r' <- liftIO (fetchToken c code state)
    case r' of
      Right authResult -> do
        setCookie "okta-user" (BS.toStrict $ BS.pack $ email $ claims authResult)
        redirect "/"
      Left e -> html . renderHtml $ H.toHtml e
    -- html . renderHtml $ callbackPage code state


type UserEmail = Text

findUserFromCookies :: Maybe CookiesText -> Maybe UserEmail
findUserFromCookies Nothing = Nothing
findUserFromCookies (Just cs) = let u = filter (\(a, _) -> a == "okta-user") cs
                                in
                                  if null u then Nothing else Just $ snd $ head u

--
-- 1. [ ] read cookie and verify state
-- 2. [X] fetch token
-- 3. [ ] error handling
-- 4. [ ] verify nonce from cookie
-- 5. [ ] set cookie and redirect to home page
--
fetchToken :: Config -> Text -> Text -> IO (Either Text AuthResult)
fetchToken c code state = do
  req <- parseRequest (baseUrl c ++ "/oauth2/v1/token")
  resp <- httpLbs (updateReq req)
  let rawBody = getResponseBody resp
  let rStatus = getResponseStatus resp
  if rStatus == status200 then do
    t <- parseSuccessResponse rawBody
    case t of
      Right authResult -> return (Right authResult)
      Left e -> print e >> return (Left $ T.pack e)
  else if rStatus == status401 then print (decode rawBody :: Maybe ErrorResponse) >> return (Left "401 status")
  else putStrLn "not handled response status code" >> return (Left "NONE status")
  -- print rawBody
  where updateReq = setM . setH . setQ
        setM = setRequestMethod "POST"
        setH = setRequestHeaders [ (hAuthorization, BS.toStrict (BS.pack "Basic: " `BS.append` B64.encode (BS.pack $ clientId c ++ ":" ++ clientSecret c)))
                                 , (hContentType, "application/x-www-form-urlencoded")
                                 ]
        setQ = setRequestQueryString $ map (second Just) [ ("grant_type", "authorization_code")
                                                         , ("code", T.encodeUtf8 code)
                                                         , ("redirect_uri", BS.toStrict (BS.pack (redirectUri c)))
                                                         ]


------------------------------
-- Stack Files
------------------------------

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

------------------------------
-- HTML
------------------------------

homePage :: Maybe UserEmail -> H.Html
homePage Nothing = H.html $ do
    H.head $ css "/css/main.css"
    H.h1 "Demo - Okta Signin Widget"
    H.ul $ do
      H.li $ H.a ! H.href "/login-okta" $ "Login Okta"
      H.li $ H.a ! H.href "/login-custom" $ "Login Custom"

homePage (Just e) = H.html $ do
    H.head $ css "/css/main.css"
    H.h1 $ H.toHtml ("Welcome " `T.append` e)

loginOktaPage :: Config -> H.Html
loginOktaPage c = H.html $ do
  H.head $ do
    js oktaAuthJs
    css "/css/main.css"
  H.h1 "Okta Login!"
  H.p $ H.a ! H.href "#" ! H.id "loginWithOkta" $ "Login with Okta"
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
