port module ElmMain exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

main : Program ProgramOptions
main =
    App.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


-- MODEL
type alias ProgramOptions =
    { loginUser : Maybe LoginUser
    }

type alias Token = String

type alias LoginUser =
    { email : String
    , name : String
    , token : Token
    , expiresAt: Int
    }

type alias Model =
    { loginUser : Maybe LoginUser
    }

init : ProgramOptions -> (Model, Cmd Msg)
init opt =
  (Model opt.loginUser, Cmd.none)


-- UPDATE

type Msg
  = Login
  | Logout
  | DoneLogin LoginUser


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Login ->
        ( model, login "" )

    Logout ->
        ( Model Nothing, logout "" )

    DoneLogin user ->
      ( Model (Just user), Cmd.none )


-- VIEW

view : Model -> Html Msg
view model =
    case model.loginUser of
        Just loginUser -> helloUserView loginUser
        Nothing -> loginView model

helloUserView : LoginUser -> Html Msg
helloUserView user =
    div []
        [ h1 [] [text ("Hello " ++ user.name)]
        , p [] [text ("email: " ++ user.email)]
        , a [ href "#", onClick Logout] [text "Logout"]
        ]

loginView : Model -> Html Msg
loginView model =
    div []
        [ h1 [] [text "Hello Okta Signin Widget"]
        , a [ href "#", onClick Login ] [text "Login"]
        , div [ id "main"] []
        ]

-- PORTs

port login : String -> Cmd msg
port logout : String -> Cmd msg

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none
