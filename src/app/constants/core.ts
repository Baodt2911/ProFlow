/**
 * Core constants used throughout the application
 */

<<<<<<< HEAD
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

=======
>>>>>>> 49fb9a9 (Add feature management user)
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = ["10", "20", "50"];
export const DEFAULT_SORT = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";

export const DATE_FORMAT = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  DATETIME: "DD/MM/YYYY HH:mm:ss",
} as const;

export const API_CONFIG = {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN: 60 * 60, // 1 hour
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN: 60 * 60 * 24 * 30, // 30 days
} as const;

export const SYSTEM_USER = {
  ID: 0,
  NAME: "System",
} as const;
