import { Switch } from "antd";
import { useFetcher } from "react-router";
import { ThemeMode } from "~/types/theme";

export default function ThemeToggle({
  currentTheme,
}: {
  currentTheme: ThemeMode;
}) {
  const fetcher = useFetcher();

  return (
    <Switch
      checked={currentTheme === "dark"}
      checkedChildren="Dark"
      unCheckedChildren="Light"
      onChange={(checked) => {
        fetcher.submit(
          { theme: checked ? "dark" : "light" },
          { method: "post", action: "/set-theme" },
        );
      }}
    />
  );
}
