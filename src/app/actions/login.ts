import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { commitSession, getSession } from "~/lib/session";
import { userService } from "~/services/userService";

export async function loginAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return Response.json(
        { error: "Email và mật khẩu không được để trống" },
        { status: 400 },
      );
    }
    const user = await userService.login({ email, password });
    const session = await getSession(request.headers.get("Cookies"));
    session.set("userId", user.id);
    session.set("role", user.role);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    if (error) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    // fallback
    console.error(error);
    return Response.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 },
    );
  }
}
