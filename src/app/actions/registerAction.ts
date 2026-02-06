import { ActionFunctionArgs, data } from "react-router";
import { userService } from "~/services/user.service";

export async function registerAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!fullName) {
      return data({ error: "Full name is required" }, { status: 400 });
    }

    if (!email || !password) {
      return data(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    await userService.register({
      fullName,
      email,
      password,
    });
    return data({
      success: true,
      message: "Registration successful",
    });
  } catch (error: any) {
    if (error) {
      return data({ error: error.message }, { status: error.status });
    }

    // fallback
    console.error(error);
    return data(
      { error: "An error occurred, please try again" },
      { status: 500 },
    );
  }
}
