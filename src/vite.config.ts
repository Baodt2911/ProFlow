import { reactRouter } from "@react-router/dev/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), ""),
  };

  return {
    server: {
      port: Number(env.PORT) || 5173,
    },
    plugins: [
      reactRouterHonoServer({
        serverEntryPoint: "./server/index.ts",
      }),
      reactRouter(),
      tsconfigPaths(),
    ],
    optimizeDeps: {
      include: ["./app/routes/**/*"],
      exclude: ["@mapbox"],
    },
  };
});
