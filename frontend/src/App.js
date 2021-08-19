import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grommet } from "grommet";
import { HomePage } from "./pages/HomePage";
import { SelectedUserContext } from "./contexts/SelectedUserContext";
import { LoggedUserContext } from "./contexts/LoggedUserContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const theme = {
  global: {
    colors: {
      brand: "#228be6",
      separator: "#dedede",
      borderBasic: "#dadada",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

const App = () => {
  const [loggedUser, setLoggedUser] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);

  return (
    <Grommet theme={theme} full>
      <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
        <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser }}>
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (loggedUser ? <HomePage /> : <Redirect to="/login" />)}
              />
              <Route path="/login"
              render={() => (!loggedUser ? <LoginPage /> : <Redirect to="/" />)}
              />
              <Route path="/register" component={RegisterPage} />
            </Switch>
          </BrowserRouter>
        </SelectedUserContext.Provider>
      </LoggedUserContext.Provider>
    </Grommet>
  );
};

export default App;
