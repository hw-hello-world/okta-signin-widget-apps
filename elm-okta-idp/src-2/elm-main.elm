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
    { loginUser : Maybe (Result Error LoginUser)
    }

type alias Error = String

type alias AuthResponse =
    { profile: Maybe LoginUser
    , error: Error
    }

init : ProgramOptions -> (Model, Cmd Msg)
init opt = case opt.loginUser of
               Just user -> (Model (Just (Ok user)), Cmd.none)
               Nothing -> (Model Nothing, Cmd.none)


-- UPDATE

type Msg
  = Login
  | Logout
  | LoginResult AuthResponse


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Login ->
        ( model, login ())

    Logout ->
        (Model Nothing, Cmd.none )

    LoginResult authResponse ->
        case authResponse.profile of
            Nothing -> (Model (Just (Err authResponse.error)), Cmd.none)
            Just profile -> ( Model (Just (Ok profile)), Cmd.none )

-- VIEW

view : Model -> Html Msg
view model =
    case model.loginUser of
        Just loginResponse -> case loginResponse of
                              Ok loginUser -> helloUserView loginUser
                              Err error -> helloErrorView error
        Nothing -> loginView model

helloUserView : LoginUser -> Html Msg
helloUserView user =
    div []
        [ h1 [] [text ("Hello " ++ user.name)]
        , p [] [text ("email: " ++ user.email)]
        , a [ href "#", onClick Logout] [text "Logout"]
        ]

helloErrorView : Error -> Html Msg
helloErrorView error =
    p [] [text error]

loginView : Model -> Html Msg
loginView model =
    div []
        [ h1 [] [text "Hello Okta Signin Widget"]
        , a [ href "#", onClick Login ] [text "Login"]
        , div [ id "main"] []
        ]

-- PORTs

port login : () -> Cmd msg
port loginResult : (AuthResponse -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model = loginResult LoginResult
