// app/routes.ts
import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

const ROUTE_FOLDER = "./routes";

export default [
  layout(`${ROUTE_FOLDER}/_protected.tsx`, [
    index(`${ROUTE_FOLDER}/_protected._index.tsx`),
    route("management-user", `${ROUTE_FOLDER}/_protected.managementUser.tsx`),
  ]),
  route("login", `${ROUTE_FOLDER}/login.tsx`),
  route("register", `${ROUTE_FOLDER}/register.tsx`),
  route("logout", `${ROUTE_FOLDER}/logout.tsx`),
  route("set-theme", `${ROUTE_FOLDER}/set-theme.tsx`),
] satisfies RouteConfig;
