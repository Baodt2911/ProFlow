import { data, LoaderFunctionArgs } from "react-router";
import { parseNumericParam } from "~/utils/core";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "~/constants/core";
import logger from "~/logger";
import { userRepository } from "~/repositories/userRepository";
import { requireAdmin } from "~/utils/auth.server";
export const managementUserLoader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  const url = new URL(request.url);
  const page = parseNumericParam(url.searchParams.get("page"), DEFAULT_PAGE);
  const limit = parseNumericParam(url.searchParams.get("limit"), DEFAULT_LIMIT);
  try {
    const users = await userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isBlocked: true,
        blockReason: true,
      },
    });
    return data(users);
  } catch (error) {
    logger.error({ err: error }, "Error in users loader");
    return data({ error: "Failed to load users" }, { status: 500 });
  }
};
