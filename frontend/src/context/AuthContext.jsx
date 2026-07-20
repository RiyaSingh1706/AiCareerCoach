import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function parseErrorMessage(res, fallback) {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token) => {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const user = await fetchProfile(token);
          setCurrentUser(user);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Invalid email or password"));
    }
    const { accessToken, refreshToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const user = await fetchProfile(accessToken);
    setCurrentUser(user);
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Could not create account"));
    }
    // Register now returns tokens directly — no need to call login() separately
    const { accessToken, refreshToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const user = await fetchProfile(accessToken);
    setCurrentUser(user);
  };

  const refreshAccessToken = async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) throw new Error("No refresh token available");

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefresh }),
    });
    if (!res.ok) {
      logout();
      throw new Error("Session expired, please log in again");
    }
    const { accessToken, refreshToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken); // rotated
    return accessToken;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
  };

  const value = { currentUser, login, signup, logout, refreshAccessToken };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
