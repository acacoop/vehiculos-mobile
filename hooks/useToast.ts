import Toast, { ToastShowParams } from "react-native-toast-message";

type ToastType = "success" | "error" | "info" | "warning";

interface ShowToastOptions {
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
}

/**
 * Hook para mostrar notificaciones toast en la app
 *
 * @example
 * const toast = useToast();
 *
 * // Mostrar toast de éxito
 * toast.success({ title: "Guardado", message: "Los cambios se guardaron correctamente" });
 *
 * // Mostrar toast de error
 * toast.error({ title: "Error", message: "No se pudo completar la operación" });
 *
 * // Mostrar toast de información
 * toast.info({ title: "Información", message: "Tienes 3 notificaciones nuevas" });
 *
 * // Mostrar toast de advertencia
 * toast.warning({ title: "Atención", message: "Tu sesión está por expirar" });
 */
export const useToast = () => {
  const showToast = (type: ToastType, options: ShowToastOptions) => {
    const params: ToastShowParams = {
      type,
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      onPress: options.onPress,
      topOffset: 50,
    };

    Toast.show(params);
  };

  return {
    success: (options: ShowToastOptions) => showToast("success", options),
    error: (options: ShowToastOptions) => showToast("error", options),
    info: (options: ShowToastOptions) => showToast("info", options),
    warning: (options: ShowToastOptions) => showToast("warning", options),
    hide: () => Toast.hide(),
  };
};

// También exportamos funciones estáticas para usar sin hook
export const toast = {
  success: (options: ShowToastOptions) => {
    Toast.show({
      type: "success",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      onPress: options.onPress,
      topOffset: 50,
    });
  },
  error: (options: ShowToastOptions) => {
    Toast.show({
      type: "error",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      onPress: options.onPress,
      topOffset: 50,
    });
  },
  info: (options: ShowToastOptions) => {
    Toast.show({
      type: "info",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      onPress: options.onPress,
      topOffset: 50,
    });
  },
  warning: (options: ShowToastOptions) => {
    Toast.show({
      type: "warning",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      onPress: options.onPress,
      topOffset: 50,
    });
  },
  hide: () => Toast.hide(),
};
