import { ActionFunctionArgs, data } from "react-router";
import { supabase } from "~/lib/supabase";
import logger from "~/logger";
import { userService } from "~/services/user.service";
import { requireUser } from "~/utils/auth.server";

export async function profileAction({ request }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const action = formData.get("action") as string;
  logger.info({ action }, "Processing profile action");
  switch (action) {
    case "profile":
      return await handleUpdateProfile(formData, userId);
    case "avatar":
      return await handleUpdateAvatar(formData, userId);
    case "password":
      return await handleChangePassword(formData, userId);
    default:
      logger.warn({ action }, "Unknown user action");
      return data(
        {
          error: "The requested action is not supported",
        },
        { status: 400 },
      );
  }
}

const handleUpdateProfile = async (formData: FormData, userId: string) => {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  if (!fullName || !email) {
    logger.warn(
      { fullName, email },
      "User creation failed: missing required fields",
    );
    return data(
      {
        error: "Missing required fields: name and email are required",
      },
      { status: 400 },
    );
  }
  try {
    const updatedUser = {
      fullName,
      email,
      phone,
      address,
    };

    await userService.updateProfile(userId, updatedUser);

    return data({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    logger.error({ err: { fullName, email } }, "User update profile failed");
    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};

const handleUpdateAvatar = async (formData: FormData, userId: string) => {
  const file = formData.get("avatar") as File;
  const oldAvatar = formData.get("oldAvatar") as string;
  const fileNameOlad = oldAvatar.split("avatars/")[1];
  try {
    if (fileNameOlad) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([fileNameOlad]);
      if (error) {
        logger.error({ err: error }, "User delete old avatar failed");
      }
    }

    if (!file) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${userId}-${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    const res = supabase.storage.from("avatars").getPublicUrl(fileName);

    await userService.updateProfile(userId, { avatarUrl: res.data.publicUrl });

    return data({
      success: true,
      message: "Avatar updated successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update avatar";
    logger.error({ err: { file } }, "User update avatar failed");
    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};

const handleChangePassword = async (formData: FormData, userId: string) => {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("confirmPassword") as string;
  try {
    await userService.changePassword(userId, currentPassword, newPassword);

    return data({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to change password";
    logger.error(
      {
        err: {
          currentPassword,
          newPassword,
        },
      },
      "User change passsword failed",
    );
    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};
