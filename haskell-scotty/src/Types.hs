{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}

module Types where

import           Data.Aeson                  (FromJSON, decode, eitherDecode,
                                              parseJSON)
import           Data.Aeson.TH               (defaultOptions, deriveJSON)
import           Data.Aeson.Types
import qualified Data.ByteString.Base64.Lazy as B64
import           Data.ByteString.Lazy        (ByteString)
import           Data.Text.Lazy              (Text)
import qualified Data.Text.Lazy              as T
import qualified Data.Text.Lazy.Encoding     as T

data SuccessResponse = SuccessResponse { accessToken :: String
                                   , tokenType       :: String
                                   , expiresIn       :: Int
                                   , scope           :: String
                                   , idToken         :: Text
                                   } deriving (Show)

instance FromJSON SuccessResponse where
    parseJSON (Object v) = SuccessResponse
                           <$> v .: "access_token"
                           <*> v .: "token_type"
                           <*> v .: "expires_in"
                           <*> v .: "scope"
                           <*> v .: "id_token"
    parseJSON _          = mempty


data ErrorResponse = ErrorResponse { errorCode        :: String
                                   , errorDescription :: String
                                   } deriving (Show)

instance FromJSON ErrorResponse where
    parseJSON (Object v) = ErrorResponse
                           <$> v .: "error"
                           <*> v .: "error_description"
    parseJSON _          = mempty


data Claims = Claims { sub   :: String
                     , email :: String
                     , ver   :: Int
                     , iss   :: String
                     , aud   :: String
                     , iat   :: Int
                     , exp   :: Int
                     , jti   :: String
                     , amr   :: [String]
                     , idp   :: String
                     , nonce :: String
                     --, auth_time :: Int
                     --, at_hash :: String
                     } deriving (Show)
$(deriveJSON defaultOptions ''Claims)

data AuthResult = AuthResult { authResp :: SuccessResponse
                             , claims   :: Claims
                             } deriving (Show)

parseSuccessResponse :: ByteString -> IO (Either String AuthResult)
parseSuccessResponse respBody = case decode respBody of
  Just tokenResp -> let idToken' = idToken tokenResp
                        xs = T.splitOn "." idToken'
                    in
                      if length xs <= 1 then return (Left "Invalid idToken")
                      else do
                          let claimsCode = xs !! 1
                          let claimsResult = eitherDecode $ B64.decodeLenient (T.encodeUtf8 claimsCode)
                          case claimsResult of
                            Right c -> return (Right $ AuthResult tokenResp c)
                            Left e -> return (Left e)
  Nothing -> return $ Left "Cant parse response body"
