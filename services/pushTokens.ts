import { apiClient, request } from "./apiClient";

interface RegisterPushTokenResponse {
  status: "success";
  data: { id: string; token: string; platform: string };
  message: string;
}

interface UnregisterPushTokenResponse {
  status: "success";
  message: string;
}

export async function registerPushToken(
  token: string,
  platform: "ios" | "android",
): Promise<boolean> {
  try {
    await apiClient.post<RegisterPushTokenResponse>("/push-tokens", {
      token,
      platform,
    });
    return true;
  } catch (error) {
    console.error("Failed to register push token", error);
    return false;
  }
}

export async function unregisterPushToken(token: string): Promise<boolean> {
  try {
    await request<UnregisterPushTokenResponse>("/push-tokens", {
      method: "DELETE",
      body: { token },
    });
    return true;
  } catch (error) {
    console.error("Failed to unregister push token", error);
    return false;
  }
}
