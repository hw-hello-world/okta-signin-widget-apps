{-# LANGUAGE OverloadedStrings #-}

-- This examples requires you to: cabal install cookie
-- and: cabal install blaze-html
module Sessions where

import           Control.Applicative     ((<$>))
import qualified Data.Binary.Builder     as B
import qualified Data.ByteString         as BS
import qualified Data.ByteString.Lazy    as BSL
import           Data.Text.Lazy          (Text)
import qualified Data.Text.Lazy.Encoding as T

import           Web.Cookie
import           Web.Scotty

makeCookie :: BS.ByteString -> BS.ByteString -> SetCookie
makeCookie n v = def { setCookieName = n, setCookieValue = v }

renderSetCookie' :: SetCookie -> Text
renderSetCookie' = T.decodeUtf8 . B.toLazyByteString . renderSetCookie

setCookie :: BS.ByteString -> BS.ByteString -> ActionM ()
setCookie n v = setHeader "Set-Cookie" (renderSetCookie' (makeCookie n v))

getCookies' :: ActionM (Maybe CookiesText)
getCookies' =
    fmap (parseCookiesText . lazyToStrict . T.encodeUtf8) <$> header "Cookie"
    where
        lazyToStrict = BS.concat . BSL.toChunks
