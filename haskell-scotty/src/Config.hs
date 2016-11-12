{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}

module Config where

import           Data.Aeson                  (FromJSON, decode, eitherDecode,
                                              parseJSON)
import           Data.Aeson.TH               (defaultOptions, deriveJSON)
import           Data.Aeson.Types
import qualified Data.ByteString.Base64.Lazy as B64
import           Data.ByteString.Lazy        (ByteString)
import qualified Data.ByteString.Lazy.Char8  as BS
import           Data.Text.Lazy              (Text)
import qualified Data.Text.Lazy              as T
import qualified Data.Text.Lazy.Encoding     as T

------------------------------
-- Config Data
------------------------------

-- FIXME: include config.json in build result
--
configFile :: String
configFile = "data/config.json"

data Config = Config { baseUrl      :: String
                     , clientId     :: String
                     , clientSecret :: String
                     , redirectUri  :: String
                     } deriving (Show)

$(deriveJSON defaultOptions ''Config)
