import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import api, { setAuthToken } from "../../services/api";

const TOKEN_KEY = "bayou_bucket_list_token";
const USER_KEY = "bayou_bucket_list_user";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const savedUser = await SecureStore.getItemAsync(USER_KEY);

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser) as User;

          setToken(savedToken);
          setUser(parsedUser);
          setAuthToken(savedToken);
        }
      } catch (error) {
        console.error("Unable to restore authentication session:", error);

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);

        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const saveSession = async (authData: AuthResponse) => {
    await SecureStore.setItemAsync(TOKEN_KEY, authData.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authData.user));

    setAuthToken(authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    await saveSession(response.data);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    await saveSession(response.data);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
