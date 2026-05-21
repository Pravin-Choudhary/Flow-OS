export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface KanbanTask {
    id: string
    flowId: string
    title: string
    priority: TaskPriority
    points: number
    assigneeInitials: string
    assigneeColor: string
    dueDate?: string
    description?: string
}

export interface KanbanProjectData {
    projectId: string
    projectName: string
    sprintName: string
    sprintDates: string
    sprintHealth: number
    doneTasks: number
    inProgressTasks: number
    reviewTasks: number
    blockedTasks: number
    columns: Record<string, KanbanTask[]>
}

// ─── Color palette for assignees (Minimal Monochromatic Theme) ───
const ASSIGNEE_COLORS: Record<string, string> = {
    PS: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85",
    RK: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85",
    MJ: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85",
    AS: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85",
}

// ─── E-Commerce Project ───
const ecommerceBoard: KanbanProjectData = {
    projectId: "ecommerce",
    projectName: "E-Commerce Platform",
    sprintName: "Sprint 4",
    sprintDates: "May 13 – May 27",
    sprintHealth: 74,
    doneTasks: 14,
    inProgressTasks: 9,
    reviewTasks: 4,
    blockedTasks: 2,
    columns: {
        backlog: [
            {
                id: "eco-b-1",
                flowId: "FLOW-046",
                title: "Implement multi-currency checkout support",
                priority: "medium",
                points: 5,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "eco-b-2",
                flowId: "FLOW-047",
                title: "Set up Redis cache for product catalog",
                priority: "low",
                points: 3,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "eco-b-3",
                flowId: "FLOW-048",
                title: "Write unit tests for cart service",
                priority: "low",
                points: 2,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "eco-b-4",
                flowId: "FLOW-049",
                title: "Implement order notification webhooks",
                priority: "medium",
                points: 4,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
        ],
        inProgress: [
            {
                id: "eco-ip-1",
                flowId: "FLOW-042",
                title: "Fix payment gateway timeout on high traffic",
                priority: "high",
                points: 8,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "eco-ip-2",
                flowId: "FLOW-043",
                title: "Dark mode toggle for dashboard",
                priority: "low",
                points: 3,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "eco-ip-3",
                flowId: "FLOW-044",
                title: "Integrate Stripe webhooks for subscriptions",
                priority: "medium",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
        ],
        review: [
            {
                id: "eco-r-1",
                flowId: "FLOW-039",
                title: "JWT auth token refresh implementation",
                priority: "high",
                points: 5,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "eco-r-2",
                flowId: "FLOW-040",
                title: "Product image lazy loading optimization",
                priority: "medium",
                points: 2,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
        ],
        done: [
            {
                id: "eco-d-1",
                flowId: "FLOW-035",
                title: "User profile & avatar upload API",
                priority: "medium",
                points: 3,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "eco-d-2",
                flowId: "FLOW-033",
                title: "Project creation & invitation flow",
                priority: "high",
                points: 8,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "eco-d-3",
                flowId: "FLOW-030",
                title: "PostgreSQL schema migration v3",
                priority: "medium",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "eco-d-4",
                flowId: "FLOW-028",
                title: "Setup CI/CD pipeline with GitHub Actions",
                priority: "low",
                points: 2,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
        ],
    },
}

// ─── Mobile App v2 Project ───
const mobileBoard: KanbanProjectData = {
    projectId: "mobile",
    projectName: "Mobile App v2",
    sprintName: "Sprint 2",
    sprintDates: "May 6 – May 20",
    sprintHealth: 61,
    doneTasks: 8,
    inProgressTasks: 6,
    reviewTasks: 3,
    blockedTasks: 1,
    columns: {
        backlog: [
            {
                id: "mob-b-1",
                flowId: "FLOW-082",
                title: "Design onboarding flow screens",
                priority: "medium",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "mob-b-2",
                flowId: "FLOW-083",
                title: "Implement biometric authentication",
                priority: "high",
                points: 8,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "mob-b-3",
                flowId: "FLOW-084",
                title: "Add offline mode support",
                priority: "medium",
                points: 6,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "mob-b-4",
                flowId: "FLOW-085",
                title: "Write E2E tests for checkout flow",
                priority: "low",
                points: 3,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
        ],
        inProgress: [
            {
                id: "mob-ip-1",
                flowId: "FLOW-078",
                title: "Implement push notification system",
                priority: "high",
                points: 8,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "mob-ip-2",
                flowId: "FLOW-079",
                title: "Build in-app camera module",
                priority: "medium",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "mob-ip-3",
                flowId: "FLOW-080",
                title: "Optimize React Native bundle size",
                priority: "low",
                points: 3,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
        ],
        review: [
            {
                id: "mob-r-1",
                flowId: "FLOW-074",
                title: "Location tracking & map integration",
                priority: "high",
                points: 8,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "mob-r-2",
                flowId: "FLOW-075",
                title: "Deep link routing configuration",
                priority: "medium",
                points: 4,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "mob-r-3",
                flowId: "FLOW-076",
                title: "App Store metadata & screenshots",
                priority: "low",
                points: 2,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
        ],
        done: [
            {
                id: "mob-d-1",
                flowId: "FLOW-068",
                title: "Setup React Native project scaffold",
                priority: "high",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "mob-d-2",
                flowId: "FLOW-069",
                title: "Configure Expo build pipeline",
                priority: "medium",
                points: 3,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "mob-d-3",
                flowId: "FLOW-070",
                title: "Implement auth context & token storage",
                priority: "high",
                points: 6,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
        ],
    },
}

// ─── Design System Project ───
const designBoard: KanbanProjectData = {
    projectId: "design",
    projectName: "Design System",
    sprintName: "Sprint 1",
    sprintDates: "May 1 – May 14",
    sprintHealth: 88,
    doneTasks: 12,
    inProgressTasks: 4,
    reviewTasks: 2,
    blockedTasks: 0,
    columns: {
        backlog: [
            {
                id: "des-b-1",
                flowId: "FLOW-111",
                title: "Create icon library documentation",
                priority: "low",
                points: 2,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "des-b-2",
                flowId: "FLOW-112",
                title: "Build Storybook for all primitives",
                priority: "medium",
                points: 6,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "des-b-3",
                flowId: "FLOW-113",
                title: "Add accessibility audit for components",
                priority: "high",
                points: 5,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "des-b-4",
                flowId: "FLOW-114",
                title: "Define spacing and grid system",
                priority: "medium",
                points: 3,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
        ],
        inProgress: [
            {
                id: "des-ip-1",
                flowId: "FLOW-108",
                title: "Implement dark/light theme tokens",
                priority: "high",
                points: 8,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
            {
                id: "des-ip-2",
                flowId: "FLOW-109",
                title: "Refactor Button component variants",
                priority: "medium",
                points: 4,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "des-ip-3",
                flowId: "FLOW-110",
                title: "Create motion & animation guidelines",
                priority: "low",
                points: 3,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
        ],
        review: [
            {
                id: "des-r-1",
                flowId: "FLOW-104",
                title: "Typography scale & font pairing",
                priority: "medium",
                points: 3,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "des-r-2",
                flowId: "FLOW-105",
                title: "Color palette semantic naming",
                priority: "high",
                points: 5,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
        ],
        done: [
            {
                id: "des-d-1",
                flowId: "FLOW-098",
                title: "Figma component library v1",
                priority: "high",
                points: 8,
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_COLORS.PS,
            },
            {
                id: "des-d-2",
                flowId: "FLOW-099",
                title: "Design token export pipeline",
                priority: "medium",
                points: 5,
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_COLORS.MJ,
            },
            {
                id: "des-d-3",
                flowId: "FLOW-100",
                title: "Brand identity guidelines v2",
                priority: "high",
                points: 6,
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_COLORS.AS,
            },
            {
                id: "des-d-4",
                flowId: "FLOW-101",
                title: "Component naming conventions doc",
                priority: "low",
                points: 2,
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_COLORS.RK,
            },
        ],
    },
}

export const PROJECT_BOARDS: Record<string, KanbanProjectData> = {
    ecommerce: ecommerceBoard,
    mobile: mobileBoard,
    design: designBoard,
}

export const COLUMN_META: Record<string, { label: string; color: string; dot: string }> = {
    backlog: {
        label: "Backlog",
        color: "text-zinc-500 dark:text-zinc-450",
        dot: "bg-zinc-400 dark:bg-zinc-500",
    },
    inProgress: {
        label: "In Progress",
        color: "text-zinc-800 dark:text-zinc-200",
        dot: "bg-zinc-500 dark:bg-zinc-400",
    },
    review: {
        label: "Review",
        color: "text-zinc-800 dark:text-zinc-200",
        dot: "bg-zinc-500 dark:bg-zinc-400",
    },
    done: {
        label: "Done",
        color: "text-zinc-800 dark:text-zinc-200",
        dot: "bg-zinc-500 dark:bg-zinc-400",
    },
}
