import { useContext, createContext, useReducer } from "react";

const UserContext = createContext(null);

const initialUser = {
  name: localStorage.getItem("medisure_name") || null,
  role: localStorage.getItem("medisure_role") || null,
  user_id: localStorage.getItem("medisure_user_id") || null,
  token: localStorage.getItem("medisure_token") || null,
};

function userReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        name: payload.name,
        role: payload.role,
        token: payload.token,
        user_id: payload.user_id,
      };
    case "LOGOUT":
      localStorage.removeItem("medisure_name");
      localStorage.removeItem("medisure_role");
      localStorage.removeItem("medisure_user_id");
      localStorage.removeItem("medisure_token");
      return { ...state, name: null, role: null, token: null, user_id: null };
    case "UPDATE_NAME":
      return { ...state, name: payload };
    default:
      console.log("Unknown User Action");
  }
}
function AuthProvider({ children }) {
  const [userState, dispatch] = useReducer(userReducer, initialUser);
  function UserLogin(user) {
    
    dispatch({ type: "LOGIN", payload: user });
    localStorage.setItem("medisure_name", user.name);
    localStorage.setItem("medisure_role", user.role);
    localStorage.setItem("medisure_user_id", user.user_id);
    localStorage.setItem("medisure_token", user.token);
  }
  function UserLogout() {
    dispatch({ type: "LOGOUT" });
  }
  function UpdateName(name) {
    dispatch({ type: "UPDATE_NAME", payload: name });
    localStorage.setItem("medisure_name", name);
  }
  return (
    <UserContext.Provider
      value={{ UserLogin, UserLogout, userState, UpdateName }}
    >
      {children}
    </UserContext.Provider>
  );
}
function useAuthContext() {
  const { UserLogin, UserLogout, userState, UpdateName } =
    useContext(UserContext);
  return { UserLogin, UserLogout, userState, UpdateName };
}
export { AuthProvider, useAuthContext };
