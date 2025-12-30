import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { configureApiClient } from "../services/apiClient";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_STORAGE_KEY = "vehiculos-auth-token";

type StorageModule = {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};

const webStorage: StorageModule = {
  async getItemAsync(key: string) {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return null;
      }
      return window.localStorage.getItem(key);
    } catch (err) {
      console.warn("Web storage getItem failed", err);
      return null;
    }
  },
  async setItemAsync(key: string, value: string) {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.warn("Web storage setItem failed", err);
    }
  },
  async deleteItemAsync(key: string) {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn("Web storage deleteItem failed", err);
    }
  },
};

const nativeStorage: StorageModule = {
  getItemAsync: (key: string) => SecureStore.getItemAsync(key),
  setItemAsync: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  deleteItemAsync: (key: string) => SecureStore.deleteItemAsync(key),
};

const storage: StorageModule =
  Platform.OS === "web" ? webStorage : nativeStorage;

const CLIENT_ID = process.env.EXPO_PUBLIC_ENTRA_CLIENT_ID;
const TENANT_ID = process.env.EXPO_PUBLIC_ENTRA_TENANT_ID;
const CUSTOM_SCHEME =
  process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || "vehiculos-aca";
const RAW_SCOPES = process.env.EXPO_PUBLIC_ENTRA_SCOPE || "";

const DEFAULT_SCOPES = ["openid", "profile", "offline_access"];
const ADDITIONAL_SCOPES = RAW_SCOPES.split(/[ ,]+/)
  .map((scope: string) => scope.trim())
  .filter(Boolean);
const REQUESTED_SCOPES = Array.from(
  new Set([...DEFAULT_SCOPES, ...ADDITIONAL_SCOPES]),
);

function getRedirectUri(): string {
  const isWeb = Platform.OS === "web";

  if (isWeb) {
    // En web, usamos la variable de entorno o generamos una por defecto
    const webRedirectUri = process.env.EXPO_PUBLIC_REDIRECT_URI_WEB;
    if (webRedirectUri) {
      return webRedirectUri;
    }
    // Fallback: genera automáticamente basado en el entorno
    return AuthSession.makeRedirectUri({
      preferLocalhost: true,
    });
  }

  // En móvil (iOS/Android), generamos el redirect URI con el scheme personalizado
  // Resultado: vehiculos-aca://redirect
  return `${CUSTOM_SCHEME}://redirect`;
}

const REDIRECT_URI = getRedirectUri();

// Log para debug - útil para verificar qué URI se está usando
if (__DEV__) {
  console.log("[auth] Platform:", Platform.OS);
  console.log("[auth] Redirect URI:", REDIRECT_URI);
}

type TokenState = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: number; // epoch ms
};

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function ensureConfig() {
  if (!CLIENT_ID || !TENANT_ID) {
    throw new Error(
      "Faltan variables de entorno EXPO_PUBLIC_ENTRA_CLIENT_ID y/o EXPO_PUBLIC_ENTRA_TENANT_ID",
    );
  }
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [tokenState, setTokenState] = useState<TokenState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const configReady = Boolean(CLIENT_ID && TENANT_ID);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const originalClose = window.close;
    const patchedClose: typeof window.close = function patchedClose() {
      try {
        return originalClose.call(window);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("Cross-Origin-Opener-Policy")
        ) {
          console.warn("[auth] window.close bloqueado por COOP, se ignora");
          return undefined;
        }
        throw err;
      }
    };
    window.close = patchedClose;
    return () => {
      window.close = originalClose;
    };
  }, []);

  const discovery = useMemo(() => {
    const tenant = TENANT_ID || "common";
    const base = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`;
    return {
      authorizationEndpoint: `${base}/authorize`,
      tokenEndpoint: `${base}/token`,
    };
  }, []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID ?? "",
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      scopes: REQUESTED_SCOPES,
      usePKCE: true,
    },
    discovery,
  );

  const persistToken = useCallback(async (state: TokenState | null) => {
    if (!state) {
      await storage.deleteItemAsync(TOKEN_STORAGE_KEY);
      return;
    }
    await storage.setItemAsync(TOKEN_STORAGE_KEY, JSON.stringify(state));
  }, []);

  const updateTokenState = useCallback(
    async (state: TokenState | null) => {
      setTokenState(state);
      await persistToken(state);
    },
    [persistToken],
  );

  const handleTokenExchange = useCallback(
    async (code: string) => {
      ensureConfig();
      if (!request) return;
      try {
        setIsLoading(true);
        if (!discovery) {
          throw new Error("No discovery document available");
        }
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID!,
            code,
            redirectUri: REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier || "",
            },
          },
          discovery,
        );
        const expiresIn = tokenResponse.expiresIn ?? 3600;
        const newState: TokenState = {
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken ?? null,
          expiresAt: Date.now() + expiresIn * 1000,
        };
        await updateTokenState(newState);
        setError(null);
      } catch (err) {
        console.error("Token exchange failed", err);
        setError(
          "No se pudo completar el inicio de sesión. Intenta nuevamente.",
        );
        await updateTokenState(null);
      } finally {
        setIsLoading(false);
      }
    },
    [request, updateTokenState, discovery],
  );

  const refreshAccessToken = useCallback(
    async (refreshToken: string | null) => {
      if (!refreshToken) return null;
      ensureConfig();
      try {
        if (!discovery) {
          throw new Error("No discovery document available");
        }
        const refreshed = await AuthSession.refreshAsync(
          {
            clientId: CLIENT_ID!,
            refreshToken,
            scopes: REQUESTED_SCOPES,
          },
          discovery,
        );
        const expiresIn = refreshed.expiresIn ?? 3600;
        const newState: TokenState = {
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken ?? refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
        };
        await updateTokenState(newState);
        return newState;
      } catch (err) {
        console.error("Token refresh failed", err);
        await updateTokenState(null);
        return null;
      }
    },
    [updateTokenState, discovery],
  );

  const restoreSession = useCallback(async () => {
    if (!configReady) {
      setIsLoading(false);
      setError(
        "Configura las variables EXPO_PUBLIC_ENTRA_CLIENT_ID y EXPO_PUBLIC_ENTRA_TENANT_ID en tu .env",
      );
      return;
    }
    try {
      const stored = await storage.getItemAsync(TOKEN_STORAGE_KEY);
      if (stored) {
        const parsed: TokenState = JSON.parse(stored);
        if (parsed.expiresAt > Date.now()) {
          setTokenState(parsed);
        } else if (parsed.refreshToken) {
          await refreshAccessToken(parsed.refreshToken);
        } else {
          await storage.deleteItemAsync(TOKEN_STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error("Failed to restore auth session", err);
      await storage.deleteItemAsync(TOKEN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [configReady, refreshAccessToken]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (!response) return;
    console.log("[auth] response", response);
    if (response.type === "success" && response.params?.code) {
      handleTokenExchange(response.params.code as string);
    } else if (response.type === "error") {
      setError(
        response.error?.message || "Proceso de inicio de sesión cancelado",
      );
      setIsLoading(false);
    } else if (response.type === "dismiss" || response.type === "cancel") {
      setIsLoading(false);
    }
  }, [response, handleTokenExchange]);

  const getAccessToken = useCallback(async () => {
    if (!tokenState) return null;
    if (tokenState.expiresAt - Date.now() > 60 * 1000) {
      return tokenState.accessToken;
    }
    const refreshed = await refreshAccessToken(tokenState.refreshToken ?? null);
    return refreshed?.accessToken ?? null;
  }, [tokenState, refreshAccessToken]);

  useEffect(() => {
    configureApiClient(getAccessToken);
  }, [getAccessToken]);

  const signIn = useCallback(async () => {
    if (!configReady) {
      setError(
        "Configura las variables EXPO_PUBLIC_ENTRA_CLIENT_ID y EXPO_PUBLIC_ENTRA_TENANT_ID en tu .env",
      );
      return;
    }
    if (!request) {
      console.warn("[auth] Solicitud de autenticación todavía no está lista");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await promptAsync({
        showInRecents: true,
      });
      console.log("[auth] promptAsync result", result);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("Cross-Origin-Opener-Policy")
      ) {
        console.warn("[auth] popup cerrado por COOP, se omite el error");
      } else {
        console.error("Login error", err);
        setError("No se pudo iniciar sesión. Intenta nuevamente.");
      }
      setIsLoading(false);
    }
  }, [configReady, promptAsync, request]);

  const signOut = useCallback(async () => {
    await updateTokenState(null);
    setError(null);
  }, [updateTokenState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(tokenState?.accessToken),
      accessToken: tokenState?.accessToken ?? null,
      signIn,
      signOut,
      getAccessToken,
      error,
    }),
    [isLoading, tokenState, signIn, signOut, getAccessToken, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
