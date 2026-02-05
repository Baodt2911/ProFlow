type PrismaModel<T> = {
  findFirst: (args?: any) => Promise<T | null>;
  findUnique: (args: any) => Promise<T | null>;
  findMany: (args?: any) => Promise<T[]>;
  create: (args: any) => Promise<T>;
  update: (args: any) => Promise<T>;
  delete: (args: any) => Promise<T>;
  count: (args?: any) => Promise<number>;
};

export const baseRepository = <T>(model: PrismaModel<T>) => ({
  findById(id: string) {
    return model.findUnique({ where: { id } });
  },
  findOne(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: any,
    options?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      include?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy?: any;
    },
  ) {
    return model.findFirst({
      where,
      ...(options?.select ? { select: options.select } : {}),
      ...(options?.include ? { include: options.include } : {}),
      ...(options?.orderBy ? { orderBy: options.orderBy } : {}),
    });
  },

  findAll(args?: any) {
    return model.findMany(args);
  },

  create(data: any) {
    return model.create({ data });
  },

  update(id: string, data: any) {
    return model.update({ where: { id }, data });
  },

  delete(id: string) {
    return model.delete({ where: { id } });
  },

  count(where?: any) {
    return model.count({ where });
  },
});
