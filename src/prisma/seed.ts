import { prisma } from "../app/lib/prisma";
import { SystemRole } from "generated/prisma/enums";
import { hashPassword } from "../app/utils/hashPassword";
const adminUser = {
  fullName: "Admin",
  email: "admin@gmail.com",
  password: "dev@123456",
  role: SystemRole.ADMIN,
};

async function main() {
  console.log("Seeding database...");
  const exists = await prisma.user.findUnique({
    where: { email: adminUser.email },
  });

  if (exists) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await hashPassword(adminUser.password);
  await prisma.user.create({
    data: {
      email: adminUser.email,
      fullName: adminUser.fullName,
      password: hashedPassword,
      role: adminUser.role,
    },
  });
  console.log("Done!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
