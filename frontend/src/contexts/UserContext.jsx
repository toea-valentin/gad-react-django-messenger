import React from "react";

const UserContext = React.createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "getList": {
        const newVal = null;
      return { users: newVal };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(userReducer, { users: null });

  const value = { state, dispatch };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used inside a UserProvider");
  }

  return context;
};


export { UserProvider, useUserContext};
