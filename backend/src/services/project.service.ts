import { prisma } from "../db";
import { NotFoundException } from "../utils/appError";
import { TaskStatusEnum } from "../enums/task.enum";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = await prisma.project.create({
    data: {
      name: body.name,
      emoji: body.emoji || "📊",
      description: body.description || null,
      workspaceId: workspaceId,
      createdById: userId,
    },
  });

  const formattedProject = {
    ...project,
    _id: project.id,
    workspace: project.workspaceId,
    createdBy: project.createdById,
  };

  return { project: formattedProject };
};

export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalCount = await prisma.project.count({
    where: {
      workspaceId: workspaceId,
    },
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await prisma.project.findMany({
    where: {
      workspaceId: workspaceId,
    },
    skip,
    take: pageSize,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const formattedProjects = projects.map((project) => ({
    ...project,
    _id: project.id,
    workspace: project.workspaceId,
    createdBy: {
      ...project.createdBy,
      _id: project.createdBy.id,
    },
  }));

  return { projects: formattedProjects, totalCount, totalPages, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
    select: {
      id: true,
      emoji: true,
      name: true,
      description: true,
    },
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  const formattedProject = {
    ...project,
    _id: project.id,
  };

  return { project: formattedProject };
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.workspaceId !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const currentDate = new Date();

  const totalTasks = await prisma.task.count({
    where: { projectId },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      projectId,
      dueDate: { lt: currentDate },
      status: { not: TaskStatusEnum.DONE },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: TaskStatusEnum.DONE,
    },
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return {
    analytics,
  };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const { name, emoji, description } = body;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(emoji && { emoji }),
      ...(name && { name }),
      ...(description !== undefined && { description }),
    },
  });

  const formattedProject = {
    ...updatedProject,
    _id: updatedProject.id,
    workspace: updatedProject.workspaceId,
    createdBy: updatedProject.createdById,
  };

  return { project: formattedProject };
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  const formattedProject = {
    ...project,
    _id: project.id,
    workspace: project.workspaceId,
    createdBy: project.createdById,
  };

  return formattedProject;
};

