export type SuccessResponse<T> = { status: true; data: T; actionType?: string };
export type ErrorResponse = {
  status: false;
  error: string;
  actionType?: string;
};
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type NotificationType = "success" | "info" | "warning" | "error";

export type ThemeMode = "light" | "dark";

export type SystemRole = "ADMIN" | "USER";
export type ActionData = {
  error?: string;
  success?: boolean;
  message?: string;
};
