/**
 * Application route paths
 * This file contains all route paths used in the application
 * to avoid hardcoding paths in multiple places
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USER_DETAIL: (userId: number) => `/users/${userId}`,
};

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.HOME];

export const DEFAULT_AUTHORIZED_PAGE = ROUTES.DASHBOARD;

export const PUBLIC_API_PATHS = [
  "/api/oauth/token",
  "/api/oauth/refresh-token",
];

export const PUBLIC_PATHS = {
  ASSETS: "/assets",
  PUBLIC: "/public",
  FAVICON: "/favicon",
  LOGO: "/logo",
  MANIFEST: "/__manifest",
  PATCHES: "/patches",
  API_DOCS: "/api-docs.yaml",
  OAUTH: "/oauth",
} as const;

export default ROUTES;
