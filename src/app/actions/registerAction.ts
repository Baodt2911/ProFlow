import { ActionFunctionArgs } from "react-router";
import { userService } from "~/services/user.service";

export async function registerAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!fullName) {
      return Response.json(
        { error: "Tên không được để trống" },
        { status: 400 },
      );
    }

    if (!email || !password) {
      return Response.json(
        { error: "Email và mật khẩu không được để trống" },
        { status: 400 },
      );
    }
    await userService.register({
      fullName,
      email,
      password,
    });
    return Response.json({
      success: true,
      message: "Đăng ký thành công",
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
