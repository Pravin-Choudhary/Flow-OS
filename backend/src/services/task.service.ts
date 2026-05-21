import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import { prisma } from "../db";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { generateTaskCode } from "../utils/uuid";

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.workspaceId !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  if (assignedTo) {
    const isAssignedUserMember = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: assignedTo,
          workspaceId,
        },
      },
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }

  const taskCode = generateTaskCode();

  const task = await prisma.task.create({
    data: {
      taskCode,
      title,
      description: description || null,
      priority: priority || TaskPriorityEnum.MEDIUM,
      status: status || TaskStatusEnum.TODO,
      assignedToId: assignedTo || null,
      createdById: userId,
      workspaceId,
      projectId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  const formattedTask = {
    ...task,
    _id: task.id,
    project: task.projectId,
    workspace: task.workspaceId,
    assignedTo: task.assignedToId,
    createdBy: task.createdById,
  };

  return { task: formattedTask };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.workspaceId !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.projectId !== projectId) {
    throw new NotFoundException(
      "Task not found or does not belong to this project"
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description !== undefined ? body.description : undefined,
      priority: body.priority,
      status: body.status,
      assignedToId: body.assignedTo !== undefined ? body.assignedTo : undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : (body.dueDate === null ? null : undefined),
    },
  });

  const formattedTask = {
    ...updatedTask,
    _id: updatedTask.id,
    project: updatedTask.projectId,
    workspace: updatedTask.workspaceId,
    assignedTo: updatedTask.assignedToId,
    createdBy: updatedTask.createdById,
  };

  return { updatedTask: formattedTask };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const where: any = {
    workspaceId: workspaceId,
  };

  if (filters.projectId) {
    where.projectId = filters.projectId;
  }

  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  if (filters.priority && filters.priority.length > 0) {
    where.priority = { in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo.length > 0) {
    where.assignedToId = { in: filters.assignedTo };
  }

  if (filters.keyword) {
    where.title = {
      contains: filters.keyword,
      mode: "insensitive",
    };
  }

  if (filters.dueDate) {
    where.dueDate = new Date(filters.dueDate);
  }

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        project: {
          select: {
            id: true,
            emoji: true,
            name: true,
          },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const formattedTasks = tasks.map((t) => ({
    ...t,
    _id: t.id,
    project: t.project
      ? {
          ...t.project,
          _id: t.project.id,
        }
      : null,
    workspace: t.workspaceId,
    assignedTo: t.assignedTo
      ? {
          ...t.assignedTo,
          _id: t.assignedTo.id,
        }
      : null,
    createdBy: t.createdById,
  }));

  return {
    tasks: formattedTasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.workspaceId !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId: workspaceId,
      projectId: projectId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  });

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  const formattedTask = {
    ...task,
    _id: task.id,
    project: task.projectId,
    workspace: task.workspaceId,
    assignedTo: task.assignedTo
      ? {
          ...task.assignedTo,
          _id: task.assignedTo.id,
        }
      : null,
    createdBy: task.createdById,
  };

  return formattedTask;
};

export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId: workspaceId,
    },
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return;
};

