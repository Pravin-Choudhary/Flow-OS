import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles, RoleType } from "../enums/role.enum";
import { prisma } from "../db";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    include: { role: true },
  });

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name as RoleType;

  return { role: roleName };
};


export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { inviteCode },
  });
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found");
  }

  const existingMember = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: workspace.id,
      },
    },
  });

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  const role = await prisma.role.findUnique({
    where: { name: Roles.MEMBER },
  });

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  await prisma.member.create({
    data: {
      userId,
      workspaceId: workspace.id,
      roleId: role.id,
    },
  });

  return { workspaceId: workspace.id, role: role.name };
};
