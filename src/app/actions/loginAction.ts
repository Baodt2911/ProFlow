import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { commitSession, getSession } from "~/lib/session";
import { userService } from "~/services/user.service";
import logger from "~/logger";
export async function loginAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) {
      return data(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    const user = await userService.login({ email, password });

    if (user.isBlocked) {
      return data(
        {
          error: `Your account has been blocked by ${user.blockedByUser?.fullName}`,
        },
        { status: 400 },
      );
    } else {
      const session = await getSession(request.headers.get("Cookies"));
      session.set("userId", user.id);
      session.set("role", user.role);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  } catch (error: any) {
    if (error) {
      return data({ error: error.message }, { status: error.status });
    }

    // fallback
    logger.error({ err: error }, "Error in login action");
    return data(
      { error: "An error occurred, please try again" },
      { status: 500 },
    );
  }
}
