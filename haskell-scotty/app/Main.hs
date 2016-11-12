{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}


module Main where

import Data.List
import qualified Data.ByteString.Base64.Lazy as B64
import Network.HTTP.Types.Status
import Data.ByteString.Lazy (ByteString)
import Data.Monoid (mempty)
import Control.Arrow (second)
import Control.Monad.IO.Class (liftIO)
import Data.Aeson (decode, FromJSON, parseJSON)
import Data.Aeson.Types
import           Data.Aeson.TH                 (defaultOptions, deriveJSON)

import Network.HTTP.Types.Header
import Network.HTTP.Simple
--import Network.HTTP.Client
import qualified Data.ByteString.Lazy.Char8 as BS
--import qualified Data.ByteString.Char8 as BS

import Data.Text (Text)
import qualified Data.Text as T
import qualified Data.Text.Encoding as T
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


data Claims = Claims { sub :: String
                     , email :: String
                     , ver :: Int
                     , iss :: String
                     , aud :: String
                     , iat :: String
                     , exp :: Int
                     , jti :: String
                     , amr :: String
                     , idp :: String
                     , nonce :: String
                     --, auth_time :: Int
                     --, at_hash :: String
                     } deriving (Show)
$(deriveJSON defaultOptions ''Claims)

data TokenResponse = TokenResponse { accessToken :: String
                                   , tokenType :: String
                                   , expiresIn :: Int
                                   , scope :: String
                                   , idToken :: String
                                   } deriving (Show)

instance FromJSON TokenResponse where
    parseJSON (Object v) = TokenResponse
                           <$> v .: "access_token"
                           <*> v .: "token_type"
                           <*> v .: "expires_in"
                           <*> v .: "scope"
                           <*> v .: "id_token"
    parseJSON _          = mempty


data ErrorResponse = ErrorResponse { errorCode :: String
                                   , errorDescription :: String
                                   } deriving (Show)

instance FromJSON ErrorResponse where
    parseJSON (Object v) = ErrorResponse
                           <$> v .: "error"
                           <*> v .: "error_description"
    parseJSON _          = mempty


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
    -- FIXME: code may not exists when the request error and it will contain
    --        error=access_denied&error_description=User+is+not+assigned+to+the+client+application
    --
    code <- param "code"
    state <- param "state"
    _ <- liftIO (fetchToken c code state)
    html . renderHtml $ callbackPage code state



--
-- 1. [ ] read cookie and verify state
-- 2. [ ] fetch token
-- 3. [ ] error handling
-- 4. [ ] verify nonce from cookie
-- 5. [ ] set cookie and redirect to home page
--
fetchToken :: Config -> Text -> Text -> IO ()
fetchToken c code state = do
  req <- parseRequest (baseUrl c ++ "/oauth2/v1/token")
  resp <- httpLbs (updateReq req)
  let rawBody = getResponseBody resp
  let rStatus = getResponseStatus resp
  if rStatus == status200 then do
    t <- return (decode rawBody :: Maybe TokenResponse)
    case t of
      Just tokenResp -> do
        let idToken' = idToken tokenResp
        let claimsCode = dropWhile (== '.') idToken'
        -- FIXME: got "invalid padding" with decode but decodeLenient is fine but its result cant be decode to JSON type
        let claims = B64.decodeLenient (BS.pack claimsCode)
        print claims
        print (decode claims :: Maybe Claims)
        print tokenResp
      Nothing -> putStrLn "Cant parse success response"
  else if rStatus == status401 then print (decode rawBody :: Maybe ErrorResponse)
  else print rawBody
  print rawBody
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
