export type SuccessResponse<T> = { status: true; data: T; actionType?: string };
export type ErrorResponse = {
  status: false;
  error: string;
  actionType?: string;
};
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
