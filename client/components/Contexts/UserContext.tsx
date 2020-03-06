import fetch from "isomorphic-unfetch";
import React, { createContext, Reducer, useEffect, useReducer } from "react";

const UserContext = createContext<AuthState>({});

const reducer: Reducer<UserState, UserAction> = (state, action) => {
  switch (action.type) {
    case "set":
      return action.data;
    case "clear":
      return {
        isLoggedIn: false
      };
    default:
      throw new Error();
  }
};

const UserContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoggedIn: false
  });
  const dispatchProxy: AuthDispatch = action => {
    switch (action.type) {
      case "fetch":
        return fetch("/api/session")
          .then(res => res.json())
          .then(({ data: { isLoggedIn, user } }) =>
            dispatch({
              type: "set",
              data: { isLoggedIn, user }
            })
          );
      default:
        return dispatch(action as UserAction);
    }
  };
  useEffect(() => {
    dispatchProxy({ type: "fetch" });
  }, []);
  return (
    <UserContext.Provider value={{ state, dispatch: dispatchProxy }}>
      {children}
    </UserContext.Provider>
  );
};

const UserContextConsumer = UserContext.Consumer;

export { UserContext, UserContextProvider, UserContextConsumer };
