import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { registerPushToken, unregisterPushToken } from "../services/pushTokens";

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId(): string | undefined {
  return Constants.expoConfig?.extra?.eas?.projectId;
}

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted");
    return null;
  }

  const projectId = getProjectId();
  if (!projectId) {
    console.error("Missing EAS projectId in app.json extra.eas.projectId");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}

// Map notification types to app routes with params
function getRouteForNotification(
  data: Record<string, unknown>,
): { pathname: string; params?: Record<string, string> } | null {
  const type = data?.type as string | undefined;
  switch (type) {
    case "reservation_created":
    case "reservation_updated":
    case "reservation_cancelled": {
      const params: Record<string, string> = {};
      if (data?.vehicleId) params.vehicleId = String(data.vehicleId);
      return { pathname: "/reservations", params };
    }
    default:
      return null;
  }
}

export function useNotifications(isAuthenticated: boolean) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const router = useRouter();

  const register = useCallback(async () => {
    try {
      const token = await getExpoPushToken();
      if (!token) return;

      setExpoPushToken(token);

      const platform = Platform.OS as "ios" | "android";
      await registerPushToken(token, platform);

      // Set up Android notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
      console.error("Failed to register for push notifications:", error);
    }
  }, []);

  const unregister = useCallback(async () => {
    if (expoPushToken) {
      await unregisterPushToken(expoPushToken);
      setExpoPushToken(null);
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (!isAuthenticated) return;

    register();

    // Handle cold-start: user tapped a notification while the app was killed
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data;
      if (__DEV__) {
        console.log("[notifications] Cold-start tap:", data);
      }
      const route = getRouteForNotification(data);
      if (route) {
        router.push(route);
      }
    });

    // Listen for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (__DEV__) {
          console.log("[notifications] Received:", notification);
        }
      });

    // Listen for user tapping on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (__DEV__) {
          console.log("[notifications] Tapped:", data);
        }

        const route = getRouteForNotification(data);
        if (route) {
          router.push(route);
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, register, router]);

  return { expoPushToken, unregister };
}
