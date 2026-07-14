/**
 * Function to save user data.
 * @param {Object} user - User data, obtained from the API.
 */
export const saveSession = (user) => {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("token", user.token);
};

/** User data, obtained from sessionStorage */
export const getSession = () => {
  return JSON.parse(sessionStorage.getItem("currentUser"));
};

/** Returns the session token, obtained from the user data in sessionStorage */
export const getSessionToken = () => {
    return getSession()?.token;
}

/** Remove user data from sessionStorage */
export const removeSession = () => {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("token");
};

/** Checks if the user is logged in, returns a boolean accordingly. */
export const isAuthenticated = () => {
  return !!getSession();
};

/** Returns the user role, obtained from the user data in sessionStorage */
export const isAdmin = () => {
  return getSession()?.role === "admin";
};