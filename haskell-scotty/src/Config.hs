{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}

module Config where

import Data.ByteString.Lazy (ByteString)
import Data.Text.Lazy (Text)
import qualified Data.Text.Lazy as T
import qualified Data.Text.Lazy.Encoding as T
import Data.Aeson (decode, FromJSON, parseJSON, eitherDecode)
import Data.Aeson.Types
import           Data.Aeson.TH                 (defaultOptions, deriveJSON)
import qualified Data.ByteString.Base64.Lazy as B64
import qualified Data.ByteString.Lazy.Char8 as BS

------------------------------
-- Config Data
------------------------------

-- FIXME: include config.json in build result
--
configFile :: String
configFile = "data/config.json"

data Config = Config { baseUrl :: String
                     , clientId :: String
                     , clientSecret :: String
                     , redirectUri :: String
                     } deriving (Show)

$(deriveJSON defaultOptions ''Config)
