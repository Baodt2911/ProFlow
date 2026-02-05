import { prisma } from "~/lib/prisma";
import { baseRepository } from "./baseRepository";
import { DEFAULT_LIMIT } from "~/constants/core";
export interface PaginationOptions {
  skip?: number;
  take?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  include?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderBy?: any;
}

export const userRepository = {
  ...baseRepository(prisma.user),

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        password: true,
        avatarUrl: true,
        googleId: true,
        role: true,
        isBlocked: true,
        blockReason: true,
        blockedAt: true,
        blockedByUser: {
          select: {
            fullName: true,
          },
        },
      },
    });
  },
  async findAndCount(options: PaginationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryOptions: any = {
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
    };

    if (options.select) {
      queryOptions.select = options.select;
    } else if (options.include) {
      queryOptions.include = options.include;
    }
    const [data, total] = await Promise.all([
      prisma.user.findMany(queryOptions),
      prisma.user.count({ where: options.where }),
    ]);
    const paginationData = {
      data,
      total,
      page:
        Math.floor((options.skip ?? 0) / (options.take ?? DEFAULT_LIMIT)) + 1,
      limit: options.take ?? DEFAULT_LIMIT,
    };

    return {
      status: true,
      ...paginationData,
    };
  },
};
