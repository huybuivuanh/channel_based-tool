import React, { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Define the initial state for the authentication context
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Define actions for changing the authentication state
const authActions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

// Define a reducer function to handle authentication actions
function authReducer(state, action) {
  switch (action.type) {
    case authActions.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        token: action.token,
      };
    case authActions.LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

// Create the authentication context
const AuthContext = createContext();

const tokenIsExpired = (token) => {
  if (!token) {
    return true; // Token doesn't exist, so it's considered expired
  }

  const decodedToken = jwtDecode(token);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < currentTimestamp) {
    console.log("Session Expired!");
  }
  return decodedToken.exp < currentTimestamp;
};

// Create an authentication provider component
export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const [authState, dispatch] = useReducer(authReducer, {
    ...initialState,
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: storedToken && !tokenIsExpired(storedToken),
  });

  useEffect(() => {
    // Function to reset the state to the initial values
    const resetAuthState = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: authActions.LOGOUT });
    };

    const checkTokenExpiration = () => {
      if (tokenIsExpired(authState.token)) {
        resetAuthState();
      }
    };

    checkTokenExpiration();

    // Set up an interval to check the token expiration every 10 mins = 600000 ms
    const tokenCheckInterval = setInterval(checkTokenExpiration, 600000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the authentication context
export function useAuth() {
  return useContext(AuthContext);
}

export { authActions };
