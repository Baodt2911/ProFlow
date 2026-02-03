import {
  type RouteConfig,
  route,
  index,
  prefix,
  layout,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const ROUTE_FOLDER = "./routes";

export default [index(`${ROUTE_FOLDER}/_index.tsx`)] satisfies RouteConfig;
