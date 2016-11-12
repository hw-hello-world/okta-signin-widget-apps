{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}

module Lib where

import Data.ByteString.Lazy (ByteString)

import Data.Aeson (decode, FromJSON, parseJSON)
import Data.Aeson.Types
import           Data.Aeson.TH                 (defaultOptions, deriveJSON)
import qualified Data.ByteString.Base64.Lazy as B64
import qualified Data.ByteString.Lazy.Char8 as BS

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


parseSuccessResponse :: ByteString -> IO (Either String Claims)
parseSuccessResponse respBody = case decode respBody of
  Just tokenResp -> let idToken' = idToken tokenResp
                        claimsCode = tail (dropWhile (/= '.') idToken')
                    in
                      do
                      print idToken'
                      print claimsCode
                      print $ B64.decodeLenient (BS.pack claimsCode)
                      case decode $ B64.decodeLenient (BS.pack claimsCode) of
                        Just c -> return $ Right c
                        Nothing -> return $ Left "Cant parse claims from response body"
  Nothing -> return $ Left "Cant parse response body"
