import { prisma } from "../db";
import { Roles } from "../enums/role.enum";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { TaskStatusEnum } from "../enums/task.enum";
import { generateInviteCode } from "../utils/uuid";

//********************************
// CREATE NEW WORKSPACE
//**************** **************/
export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await prisma.role.findUnique({
    where: { name: Roles.OWNER },
  });

  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const inviteCode = generateInviteCode();

  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        description: description || null,
        ownerId: user.id,
        inviteCode,
      },
    });

    await tx.member.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        roleId: ownerRole.id,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { currentWorkspaceId: workspace.id },
    });

    const formattedWorkspace = {
      ...workspace,
      owner: workspace.ownerId,
    };

    return {
      workspace: formattedWorkspace,
    };
  });
};

//********************************
// GET WORKSPACES USER IS A MEMBER
//**************** **************/
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await prisma.member.findMany({
    where: { userId },
    include: {
      workspace: true,
    },
  });

  const workspaces = memberships.map((membership) => ({
    ...membership.workspace,
    owner: membership.workspace.ownerId,
  }));

  return { workspaces };
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await prisma.member.findMany({
    where: { workspaceId },
    include: { role: true },
  });

  const formattedMembers = members.map((member) => ({
    ...member,
    role: member.role,
  }));

  const workspaceWithMembers = {
    ...workspace,
    owner: workspace.ownerId,
    members: formattedMembers,
  };

  return {
    workspace: workspaceWithMembers,
  };
};

//********************************
// GET ALL MEMBERS IN WORKSPACE
//**************** **************/
export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await prisma.member.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      },
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const formattedMembers = members.map((member) => ({
    ...member,
    userId: member.user,
    role: member.role,
  }));

  return { members: formattedMembers, roles };
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await prisma.task.count({
    where: { workspaceId },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      workspaceId,
      dueDate: { lt: currentDate },
      status: { not: TaskStatusEnum.DONE },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      workspaceId,
      status: TaskStatusEnum.DONE,
    },
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });
  if (!role) {
    throw new NotFoundException("Role not found");
  }

  const member = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId: workspaceId,
      },
    },
  });

  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  const updatedMember = await prisma.member.update({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId: workspaceId,
      },
    },
    data: {
      roleId: role.id,
    },
    include: { role: true },
  });

  return {
    member: updatedMember,
  };
};

//********************************
// UPDATE WORKSPACE
//**************** **************/
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: name || workspace.name,
      description: description !== undefined ? description : workspace.description,
    },
  });

  const formattedWorkspace = {
    ...updatedWorkspace,
    owner: updatedWorkspace.ownerId,
  };

  return {
    workspace: formattedWorkspace,
  };
};

export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    if (workspace.ownerId !== userId) {
      throw new BadRequestException(
        "You are not authorized to delete this workspace"
      );
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Explicit cascades (safety fallback)
    await tx.project.deleteMany({ where: { workspaceId: workspace.id } });
    await tx.task.deleteMany({ where: { workspaceId: workspace.id } });
    await tx.member.deleteMany({ where: { workspaceId: workspace.id } });

    let updatedCurrentWorkspaceId = user.currentWorkspaceId;

    if (user.currentWorkspaceId === workspaceId) {
      const memberWorkspace = await tx.member.findFirst({
        where: { userId },
      });
      updatedCurrentWorkspaceId = memberWorkspace ? memberWorkspace.workspaceId : null;
      await tx.user.update({
        where: { id: userId },
        data: { currentWorkspaceId: updatedCurrentWorkspaceId },
      });
    }

    await tx.workspace.delete({
      where: { id: workspaceId },
    });

    return {
      currentWorkspace: updatedCurrentWorkspaceId,
    };
  });
};
