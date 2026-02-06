import { LoaderFunctionArgs } from "react-router";
import { userRepository } from "~/repositories/userRepository";
import { requireUser } from "~/utils/auth.server";

export const profileLoader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);

  const user = await userRepository.findById(userId);

  const { password, ...userWithoutPassword } = user || {};
  return { user: userWithoutPassword };
};
