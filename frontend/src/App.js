import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Restaurants } from "./containers/Restaurants";
import { Foods } from "./containers/Foods";
import { Orders } from "./containers/Orders";

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/restaurants">
          <Restaurants />
        </Route>
        <Route
          exact
          path="/foods"
        >
          <Foods />
        </Route>
        <Route
          exact
          path="/orders">
          <Orders />
        </Route>
        <Route
          exact
          path="/restaurants/:restaurantsId/foods"
          render={({ match }) => (
            <Foods match={match} />
            )
          }
        />
      </Switch>
    </Router>
  );
}

export default App;
