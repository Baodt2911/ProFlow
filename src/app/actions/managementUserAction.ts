import bcrypt from "bcrypt";
import { SystemRole } from "generated/prisma/enums";
import { ActionFunctionArgs, data } from "react-router";
import logger from "~/logger";
import { userRepository } from "~/repositories/userRepository";
import { userService } from "~/services/user.service";
import { requireAdmin } from "~/utils/auth.server";

export async function managementUserAction({ request }: ActionFunctionArgs) {
  const adminId = await requireAdmin(request);
  const formData = await request.formData();
  const action = formData.get("action") as string;
  logger.info({ action }, "Processing user action");

  switch (action) {
    case "create":
      return await handleCreateUser(formData);
    case "update":
      return await handleUpdateUser(formData);
    case "delete":
      return await handleDeleteUser(formData, adminId);
    case "block":
      return await handleBlockUser(formData, adminId);
    case "unblock":
      return await handleUnblockUser(formData, adminId);
    default:
      logger.warn({ action }, "Unknown user action");
      return data(
        {
          error: "Unknown action",
          error_description: "The requested action is not supported",
        },
        { status: 400 },
      );
  }
}

const handleCreateUser = async (formData: FormData) => {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as SystemRole;
  logger.info({ fullName, email }, "Processing user creation");
  if (!fullName || !email || !password) {
    logger.warn(
      { fullName, email },
      "User creation failed: missing required fields",
    );
    return data(
      {
        error: "Thiếu các trường bắt buộc: tên, email và mật khẩu  là bắt buộc",
      },
      { status: 400 },
    );
  }
  try {
    const isEmailExists = await userRepository.findByEmail(email);
    if (isEmailExists) {
      logger.warn({ email }, "User creation failed: email already exists");
      return data({ error: "Email already exists" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await userRepository.create({
      fullName,
      email,
      password: hashPassword,
      role: role || SystemRole.USER,
    });

    logger.info(
      { fullName, email, userId: user.id },
      "User created successfully",
    );
    return data({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create user";
    logger.error({ err: error, fullName, email }, "User creation failed");
    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};

const handleUpdateUser = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as SystemRole;
  logger.info({ userId, fullName, email }, "Processing user update");

  if (!userId || !fullName || !email) {
    logger.warn(
      { userId, fullName, email },
      "User update failed: missing required fields",
    );
    return data(
      {
        error: "Thiếu các trường bắt buộc: userId, tên và email là bắt buộc",
      },
      { status: 400 },
    );
  }

  const isUserExists = await userRepository.findById(userId);
  if (!isUserExists) {
    logger.warn({ userId }, "User update failed: user not found");
    return data({ error: "User not found" }, { status: 400 });
  }

  // Kiểm tra trong db đã có ngừoi nào dùng email này chưa
  const isEmailExists = await userRepository.findOne({
    email,
    id: { not: userId },
  });
  if (isEmailExists) {
    logger.warn({ email }, "User update failed: email already exists");
    return data({ error: "Email đã tồn tại" }, { status: 400 });
  }

  try {
    const updateData: {
      fullName?: string;
      email?: string;
      role?: SystemRole;
      password?: string;
    } = {
      fullName,
      email,
      role,
    };
    if (password) {
      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
      const hashPassword = await bcrypt.hash(password, salt);
      updateData.password = hashPassword;
    }

    const user = await userRepository.update(userId, updateData);
    logger.info({ userId, fullName, email }, "User updated successfully");
    return data({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update user";
    logger.error({ err: error, userId }, "User update failed");

    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};
const handleDeleteUser = async (formData: FormData, adminId: string) => {
  const userId = formData.get("userId") as string;
  logger.info({ userId }, "Processing user deletion");

  const isUserExists = await userRepository.findById(userId);
  if (!isUserExists) {
    logger.warn({ userId }, "User deletion failed: user not found");
    return data({ error: "User not found" }, { status: 400 });
  }

  try {
    await userService.deleteUser(adminId, userId);

    logger.info({ userId }, "User deleted successfully");
    return data({ success: true, userId });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";
    logger.error({ err: error, userId }, "User deletion failed");

    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};
const handleBlockUser = async (formData: FormData, adminId: string) => {
  const userId = formData.get("userId") as string;
  const reason = formData.get("reason") as string;
  logger.info({ userId }, "Processing user block");

  const isUserExists = await userRepository.findById(userId);
  if (!isUserExists) {
    logger.warn({ userId }, "User block failed: user not found");
    return data({ error: "User not found" }, { status: 400 });
  }

  try {
    await userService.blockUser(adminId, userId, reason);

    logger.info({ userId }, "User blocked successfully");
    return data({ success: true, userId });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to blocked user";
    logger.error({ err: error, userId }, "User block failed");

    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};

const handleUnblockUser = async (formData: FormData, adminId: string) => {
  const userId = formData.get("userId") as string;
  logger.info({ userId }, "Processing user unblock");

  const isUserExists = await userRepository.findById(userId);
  if (!isUserExists) {
    logger.warn({ userId }, "User unblock failed: user not found");
    return data({ error: "User not found" }, { status: 400 });
  }

  try {
    await userService.unblockUser(adminId, userId);

    logger.info({ userId }, "User unblocked successfully");
    return data({ success: true, userId });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to unblocked user";
    logger.error({ err: error, userId }, "User unblock failed");

    return data(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
};
