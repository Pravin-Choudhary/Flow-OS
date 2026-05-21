import { prisma } from "../db";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      currentWorkspace: true,
    },
  });

  if (!user) {
    throw new BadRequestException("User not found");
  }

  const { password: _, ...userWithoutPassword } = user;

  const formattedUser = {
    ...userWithoutPassword,
    _id: userWithoutPassword.id,
    currentWorkspace: userWithoutPassword.currentWorkspace
      ? {
          ...userWithoutPassword.currentWorkspace,
          _id: userWithoutPassword.currentWorkspace.id,
        }
      : null,
  };

  return {
    user: formattedUser,
  };
};

