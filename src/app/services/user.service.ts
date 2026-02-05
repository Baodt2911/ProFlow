import { userRepository } from "~/repositories/userRepository";
import bcrypt from "bcrypt";
import { UserCreateInput } from "generated/prisma/models";
interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}
interface LoginInput {
  email: string;
  password: string;
}
export const userService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    const hashPassword = await bcrypt.hash(input.password, salt);

    return userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashPassword,
    });
  },
  async login(input: LoginInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (!existingUser) {
      throw new Error("Email không tồn tại");
    }

    const isPassword = await bcrypt.compare(
      input.password,
      existingUser.password,
    );
    if (!isPassword) {
      throw new Error("Mật khẩu không đúng");
    }
    const { password, googleId, ...other } = existingUser;
    return other;
  },

  async deleteUser(adminId: string, userId: string) {
    const admin = await userRepository.findById(adminId);

    if (admin?.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    return await userRepository.delete(userId);
  },

  async blockUser(adminId: string, userId: string, reason?: string) {
    const admin = await userRepository.findById(adminId);
    if (admin?.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    return await userRepository.update(userId, {
      isBlocked: true,
      blockedAt: new Date(),
      blockedBy: adminId,
      blockReason: reason,
    });
  },

  async unblockUser(adminId: string, userId: string) {
    const admin = await userRepository.findById(adminId);
    if (admin?.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    return await userRepository.update(userId, {
      isBlocked: false,
      blockedAt: null,
      blockedBy: null,
      blockReason: null,
    });
  },
};
