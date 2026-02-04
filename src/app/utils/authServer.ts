import { redirect } from "react-router";
import { getSession } from "~/lib/session";

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}

export async function redirectIfAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (userId) {
    throw redirect("/");
  }
}
