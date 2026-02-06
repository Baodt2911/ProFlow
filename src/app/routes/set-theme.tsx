import { ActionFunctionArgs, redirect } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme");
  if (theme !== "light" && theme !== "dark") {
    return redirect("/");
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": `theme=${theme}; Path=/; Max-Age=31536000`,
    },
  });
}
