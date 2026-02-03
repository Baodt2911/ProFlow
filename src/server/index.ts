import { createHonoServer } from "react-router-hono-server/node";
import * as dotenv from "dotenv";

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;
const isProductionMode = mode === "production";

if (!isProductionMode) {
  dotenv.config({ path: ".env" });
}

declare module "react-router" {
  interface AppLoadContext {
    readonly appVersion?: string;
  }
}

export default await createHonoServer({
  defaultLogger: true,
  port: Number(process.env.PORT) || 3000,
  getLoadContext(_, { build, mode }) {
    const isProductionMode = mode === "production";
    return {
      appVersion: isProductionMode ? build.assets.version : "dev",
    };
  },
  listeningListener: (info) => {
    console.log(`🚀 Server running on http://localhost:${info.port}`);
  },
});
