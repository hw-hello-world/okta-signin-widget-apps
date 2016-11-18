import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Time
import Task

main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = (\_ -> Sub.none)
    }



-- MODEL


type alias Model =
  { name : String
  }


init : ( Model, Cmd Msg )
init =
  ( Model "Welcome to Elm world" , Cmd.none )



-- UPDATE


type Msg
  = Hello
  | World
  | MyTime Time.Time


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Hello ->
        ( { model | name = "Hello" } , Cmd.none )
    World ->
        ( { model | name = "World" } , Cmd.none )
    MyTime t ->
        ( { model | name = ("Infinit Time: " ++ toString t) } , fetchTime )

-- !!! an infinit flow created !!!
fetchTime : Cmd Msg
fetchTime = Task.perform MyTime Time.now

-- VIEW


view : Model -> Html Msg
view model =
  div []
      [ h1 [] [ text (model.name) ]
      , ul []
          [ li [] [ a [href "#", onClick Hello] [text "say hello"] ]
          , li [] [ a [href "#", onClick World] [text "say world"] ]
          , li [] [ a [href "#", onClick (MyTime 12345)] [text "infinit time"] ]
          ]
      ]
