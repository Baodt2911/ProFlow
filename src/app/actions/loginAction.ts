import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { commitSession, getSession } from "~/lib/session";
import { userService } from "~/services/user.service";
import logger from "~/logger";
export async function loginAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email, password });
    if (!email || !password) {
      return Response.json(
        { error: "Email và mật khẩu không được để trống" },
        { status: 400 },
      );
    }
    const user = await userService.login({ email, password });

    if (user.isBlocked) {
      return Response.json(
        {
          error: `Tài khoản của bạn đã bị khóa bởi ${user.blockedByUser?.fullName}`,
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
      return Response.json({ error: error.message }, { status: error.status });
    }

    // fallback
    logger.error({ err: error }, "Error in login action");
    return Response.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 },
    );
  }
}
