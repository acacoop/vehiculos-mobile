const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/?$/u, "");

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

let accessTokenResolver: (() => Promise<string | null>) | null = null;

export function configureApiClient(resolver: () => Promise<string | null>) {
  accessTokenResolver = resolver;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  if (!API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL no está definido. Agrega la URL base del backend en tu .env"
    );
  }

  const url = new URL(path, `${API_BASE_URL}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function resolveAccessToken() {
  if (!accessTokenResolver) return null;
  try {
    return await accessTokenResolver();
  } catch (err) {
    console.error("No se pudo obtener el access token", err);
    return null;
  }
}

function normaliseHeaders(
  existing: Record<string, string> | undefined,
  includeJson: boolean
) {
  const headers = new Headers(existing);
  if (includeJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return headers;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: rawHeaders,
    query,
    skipAuth,
  } = options;

  const url = buildUrl(path, query);
  const includeJson = body !== undefined && body !== null;
  const headers = normaliseHeaders(rawHeaders, includeJson);

  if (!skipAuth) {
    const token = await resolveAccessToken();
    if (!token) {
      throw new Error(
        "Sesión no válida o token ausente. Inicia sesión nuevamente."
      );
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: includeJson ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      isJson && payload?.message
        ? payload.message
        : typeof payload === "string"
          ? payload
          : "Error desconocido al llamar a la API";
    throw new Error(message);
  }

  if (isJson && payload?.status && payload.status !== "success") {
    throw new Error(payload.message || "La API devolvió un estado de error");
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "DELETE" }),
};
