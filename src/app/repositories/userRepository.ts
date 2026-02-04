import { prisma } from "~/lib/prisma";
import { baseRepository } from "./baseRepository";

export const userRepository = {
  ...baseRepository(prisma.user),

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
