import { redirect } from "react-router";
import { getSession } from "~/lib/session";
import { SystemRole } from "generated/prisma/enums";

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
export async function requireAdmin(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const role = session.get("role");

  if (role !== SystemRole.ADMIN) {
    throw redirect("/");
  }

  return session.get("userId");
}
export async function redirectIfAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (userId) {
    throw redirect("/");
  }
}
