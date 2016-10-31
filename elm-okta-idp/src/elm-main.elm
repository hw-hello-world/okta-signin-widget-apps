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


-- PORTs

port login : String -> Cmd msg
port logout : String -> Cmd msg
port donelogin : (LoginUser -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model = donelogin DoneLogin


-- VIEW

view : Model -> Html Msg
view model =
    case model.loginUser of
        Just loginUser -> mainView loginUser
        Nothing -> loginView model

mainView : LoginUser -> Html Msg
mainView user =
    div [ id "main"]
        [ h1 [] [text ("Hello " ++ user.name)]
        , a [ href "#", onClick Logout] [text "Logout"]
        ]

loginView : Model -> Html Msg
loginView model =
    div [ id "main"]
        [ h1 [] [text "Hello Okta Signin Widget"]
        , a [ href "#", onClick Login ] [text "Login"]
        ]
