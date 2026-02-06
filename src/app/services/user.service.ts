import { hashPassword } from "./../utils/hashPassword";
import { userRepository } from "~/repositories/userRepository";
import bcrypt from "bcrypt";
import { UserCreateInput } from "generated/prisma/models";
import { prisma } from "~/lib/prisma";
interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}
interface UpdateProfileInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
}
interface LoginInput {
  email: string;
  password: string;
}

export const userService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await hashPassword(input.password);

    return userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
    });
  },
  async login(input: LoginInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (!existingUser) {
      throw new Error("Email does not exist");
    }

    const isPassword = await bcrypt.compare(
      input.password,
      existingUser.password,
    );
    if (!isPassword) {
      throw new Error("Incorrect password");
    }
    const { password, googleId, ...other } = existingUser;
    return other;
  },

  async updateProfile(userId: string, data: Partial<UpdateProfileInput>) {
    return userRepository.update(userId, data);
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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(newPassword);

    return userRepository.update(userId, { password: hashedPassword });
  },
};
