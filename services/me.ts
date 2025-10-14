import { apiClient } from "./apiClient";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cuit: string;
}

interface CurrentUserResponse {
  status: "success";
  data: CurrentUser;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await apiClient.get<CurrentUserResponse>("/me");
    return response.data;
  } catch (error) {
    console.error("No se pudo obtener el usuario actual", error);
    return null;
  }
}
