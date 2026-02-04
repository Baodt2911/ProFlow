type PrismaModel<T> = {
  findUnique: (args: any) => Promise<T | null>;
  findMany: (args?: any) => Promise<T[]>;
  create: (args: any) => Promise<T>;
  update: (args: any) => Promise<T>;
  delete: (args: any) => Promise<T>;
  count: (args?: any) => Promise<number>;
};

export const baseRepository = <T>(model: PrismaModel<T>) => ({
  findById(id: number) {
    return model.findUnique({ where: { id } });
  },

  findMany(args?: any) {
    return model.findMany(args);
  },

  create(data: any) {
    return model.create({ data });
  },

  update(id: number, data: any) {
    return model.update({ where: { id }, data });
  },

  delete(id: number) {
    return model.delete({ where: { id } });
  },

  count(where?: any) {
    return model.count({ where });
  },
});
