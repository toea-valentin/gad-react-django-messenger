import React from "react";

const LoggedUserContext = React.createContext({
   loggedUser: null,
   setLoggedUser: (user) => {}
});

export { LoggedUserContext };
