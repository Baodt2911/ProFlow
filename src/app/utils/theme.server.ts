import { ThemeMode } from "~/types";

export function getSystemTheme(request: Request): ThemeMode {
  const header = request.headers.get("Sec-CH-Prefers-Color-Scheme");

  if (header === "dark") return "dark";
  if (header === "light") return "light";

  return "light";
}

export function resolveTheme(request: Request): ThemeMode {
  const cookie = request.headers.get("Cookie");
  if (cookie?.includes("theme=dark")) return "dark";
  if (cookie?.includes("theme=light")) return "light";

  return getSystemTheme(request);
}
