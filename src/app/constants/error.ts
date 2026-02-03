/**
 * Error constants used throughout the application
 */

export const GENERAL_ERROR = "General error";

export const AUTH_ERRORS = {
  INVALID_CREDENTIAL: "Invalid credentials",
};

export enum ERROR_CODES {
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_TOKEN = "INVALID_TOKEN",
  FORBIDDEN = "FORBIDDEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  NOT_FOUND = "NOT_FOUND",
  METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
  BAD_REQUEST = "BAD_REQUEST",
  GENERAL_ERROR = "GENERAL_ERROR",
}

export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: "Unauthorized",
  [ERROR_CODES.INVALID_TOKEN]: "Invalid token",
  [ERROR_CODES.FORBIDDEN]: "Forbidden",
  [ERROR_CODES.TOKEN_EXPIRED]: "Token expired",
  [ERROR_CODES.METHOD_NOT_ALLOWED]: "Method not allowed",
  [ERROR_CODES.BAD_REQUEST]: "Bad request",
  [ERROR_CODES.NOT_FOUND]: "Not found",
  [ERROR_CODES.GENERAL_ERROR]: "General error",
} as const;
