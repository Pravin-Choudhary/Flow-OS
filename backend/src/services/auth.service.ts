import { prisma } from "../db";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { hashValue, compareValue } from "../utils/bcrypt";
import { generateInviteCode } from "../utils/uuid";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  return await prisma.$transaction(async (tx) => {
    console.log("Started Prisma transaction...");

    let user = await tx.user.findFirst({
      where: { email },
    });

    if (!user) {
      // 1. Create a new user
      user = await tx.user.create({
        data: {
          email: email || "",
          name: displayName,
          profilePicture: picture || null,
        },
      });

      // 2. Create the Account link
      await tx.account.create({
        data: {
          userId: user.id,
          provider: provider,
          providerId: providerId,
        },
      });

      // 3. Create a default workspace for the new user
      const inviteCode = generateInviteCode();
      const workspace = await tx.workspace.create({
        data: {
          name: `My Workspace`,
          description: `Workspace created for ${user.name}`,
          ownerId: user.id,
          inviteCode: inviteCode,
        },
      });

      // 4. Find the Owner Role
      const ownerRole = await tx.role.findUnique({
        where: { name: Roles.OWNER },
      });

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      // 5. Create a Member record in the workspace
      await tx.member.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          roleId: ownerRole.id,
        },
      });

      // 6. Update user's currentWorkspaceId
      user = await tx.user.update({
        where: { id: user.id },
        data: { currentWorkspaceId: workspace.id },
      });
    }

    console.log("Prisma transaction committed...");
    const { password: _, ...userWithoutPassword } = user;
    const formattedUser = {
      ...userWithoutPassword,
      _id: userWithoutPassword.id,
      currentWorkspace: userWithoutPassword.currentWorkspaceId,
    };
    return { user: formattedUser };
  });
};

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;

  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await hashValue(password);

    // 1. Create user
    const user = await tx.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 2. Create Account
    await tx.account.create({
      data: {
        userId: user.id,
        provider: ProviderEnum.EMAIL,
        providerId: email,
      },
    });

    // 3. Create default workspace
    const inviteCode = generateInviteCode();
    const workspace = await tx.workspace.create({
      data: {
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        ownerId: user.id,
        inviteCode: inviteCode,
      },
    });

    // 4. Find Owner role
    const ownerRole = await tx.role.findUnique({
      where: { name: Roles.OWNER },
    });

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    // 5. Create Member link
    await tx.member.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        roleId: ownerRole.id,
      },
    });

    // 6. Set user current workspace
    await tx.user.update({
      where: { id: user.id },
      data: { currentWorkspaceId: workspace.id },
    });

    return {
      userId: user.id,
      workspaceId: workspace.id,
    };
  });
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await prisma.account.findUnique({
    where: { providerId: email },
  });
  if (!account || account.provider !== provider) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await prisma.user.findUnique({
    where: { id: account.userId },
  });

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  if (!user.password) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const isMatch = await compareValue(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    _id: userWithoutPassword.id,
    currentWorkspace: userWithoutPassword.currentWorkspaceId,
  };
};
