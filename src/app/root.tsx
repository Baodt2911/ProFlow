import {
  isRouteErrorResponse,
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "react-router";
import { ConfigProvider, theme as themeAntd } from "antd";
import antdReset from "antd/dist/reset.css?url";
import type { Route } from "./+types/root";
import { darkTheme, lightTheme } from "./config/theme";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "stylesheet", href: antdReset },
];

import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const theme = cookie?.includes("theme=dark") ? "dark" : "light";

  return { theme };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function useSystemThemeSync() {
  const fetcher = useFetcher();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      fetcher.submit(
        { theme: media.matches ? "dark" : "light" },
        { method: "post", action: "/set-theme" },
      );
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
}

export default function App() {
  useSystemThemeSync();
  const { theme } = useLoaderData<typeof loader>();
  console.log(theme);

  const isDark = theme === "dark";
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? themeAntd.darkAlgorithm
          : themeAntd.defaultAlgorithm,
        token: isDark ? darkTheme.token : lightTheme.token,
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
