import { useContext, createContext, useReducer } from "react";

const UserContext = createContext(null);

const initialUser = {
  role: localStorage.getItem("medisure_role") || null,
  user_id: localStorage.getItem("medisure_user_id") || null,
  token: localStorage.getItem("medisure_authToken") || null,
};

function userReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        role: payload.medisure_role,
        token: payload.medisure_token,
        user_id: payload.medisure_user_id,
      };
    case "LOGOUT":
      localStorage.removeItem("medisure_role");
      localStorage.removeItem("medisure_user_id");
      localStorage.removeItem("medisure_token");
      return { ...state, role: null, token: null, user_id: null };
    default:
      console.log("Unknown User Action");
  }
}
function AuthProvider({ children }) {
  const [userState, dispatch] = useReducer(userReducer, initialUser);
  function UserLogin(user) {
    alert("CALLED");
    dispatch({ type: "LOGIN", payload: user });
    localStorage.setItem("medisure_role", user.role);
    localStorage.setItem("medisure_user_id", user.user_id);
    localStorage.setItem("medisure_authToken", user.token);
  }
  function UserLogout() {
    dispatch({ type: "LOGOUT" });
  }
  return (
    <UserContext.Provider value={{ UserLogin, UserLogout, userState }}>
      {children}
    </UserContext.Provider>
  );
}
function useAuthContext() {
  const { UserLogin, UserLogout, userState } = useContext(UserContext);
  return { UserLogin, UserLogout, userState };
}
export { AuthProvider, useAuthContext };
