export interface BacklogTask {
    id: string
    flowId: string
    title: string
    priority: "low" | "medium" | "high" | "urgent" | "none"
    assigneeName: string
    assigneeInitials: string
    assigneeColor: string
    points: number
    status: string
    sprint: string
    dueDate: string
    createdDate: string
    labels: string[]
    description: string
    subtasks: { id: string; title: string; completed: boolean }[]
    activities: {
        id: string
        author: string
        authorInitials: string
        authorColor: string
        comment: string
        timeAgo: string
    }[]
}

export interface ProjectBacklogData {
    projectId: string
    projectName: string
    tasks: BacklogTask[]
}

const ASSIGNEE_STYLE = "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85"

// Mock Backlog data for all projects
export const PROJECT_BACKLOGS: Record<string, ProjectBacklogData> = {
    ecommerce: {
        projectId: "ecommerce",
        projectName: "E-Commerce Platform",
        tasks: [
            {
                id: "eco-bl-1",
                flowId: "FLOW-050",
                title: "Implement OAuth2 social login",
                priority: "high",
                assigneeName: "Arjun Sharma",
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_STYLE,
                points: 8,
                status: "Backlog",
                sprint: "Sprint 4",
                dueDate: "2026-05-27",
                createdDate: "May 14, 2026",
                labels: ["Security", "Authentication", "Sprint Backlog"],
                description: "The payment gateway times out intermittently under high load (200+ concurrent requests). Need to implement connection pooling, increase timeout thresholds, and add retry logic with exponential backoff. Investigate whether issue is Stripe-specific or affects the entire payment flow.",
                subtasks: [
                    { id: "s1", title: "Reproduce timeout in staging", completed: true },
                    { id: "s2", title: "Profile DB connection pool usage", completed: true },
                    { id: "s3", title: "Implement connection pool tuning", completed: false },
                    { id: "s4", title: "Add retry with exponential backoff", completed: false },
                    { id: "s5", title: "Load test with 500 concurrent users", completed: false },
                    { id: "s6", title: "Write regression tests", completed: false },
                ],
                activities: [
                    {
                        id: "act-1",
                        author: "Rahul Kumar",
                        authorInitials: "RK",
                        authorColor: ASSIGNEE_STYLE,
                        comment: "Reproduced in staging with 200 concurrent users — drops start at ~180 req/s. Pool hits max connections. Will push a fix tomorrow.",
                        timeAgo: "18 minutes ago"
                    },
                    {
                        id: "act-2",
                        author: "Arjun Sharma",
                        authorInitials: "AS",
                        authorColor: ASSIGNEE_STYLE,
                        comment: "Check if we can bump pool size to 50. Consider PgBouncer as middleware. This is P0 — needs resolving before Sprint 4 ends.",
                        timeAgo: "Just now"
                    }
                ]
            },
            {
                id: "eco-bl-2",
                flowId: "FLOW-051",
                title: "Email notification system for task updates",
                priority: "medium",
                assigneeName: "Priya Singh",
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_STYLE,
                points: 5,
                status: "Backlog",
                sprint: "Sprint 4",
                dueDate: "2026-06-03",
                createdDate: "May 15, 2026",
                labels: ["Feature", "Notifications"],
                description: "Setup automatic email dispatch via Resend/SendGrid when tasks are moved between column states, commented on, or reassigned. Need template designs for dark/light themes.",
                subtasks: [
                    { id: "s1", title: "Design responsive email templates", completed: false },
                    { id: "s2", title: "Integrate SendGrid API client", completed: false },
                    { id: "s3", title: "Configure event triggers in board state", completed: false },
                ],
                activities: []
            },
            {
                id: "eco-bl-3",
                flowId: "FLOW-052",
                title: "Build export to CSV / PDF report",
                priority: "low",
                assigneeName: "Rahul Kumar",
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_STYLE,
                points: 3,
                status: "Backlog",
                sprint: "Sprint 4",
                dueDate: "2026-06-10",
                createdDate: "May 16, 2026",
                labels: ["Reports", "CSV", "PDF"],
                description: "Export current sprint reports, board views, and metrics reports into CSV or PDF format for stakeholder meetings.",
                subtasks: [
                    { id: "s1", title: "Define report schemas", completed: true },
                    { id: "s2", title: "Integrate PDFkit exporter library", completed: false },
                    { id: "s3", title: "Build CSV generation logic", completed: false },
                ],
                activities: []
            },
            {
                id: "eco-bl-4",
                flowId: "FLOW-053",
                title: "Keyboard shortcuts documentation",
                priority: "none",
                assigneeName: "Meera Joshi",
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_STYLE,
                points: 1,
                status: "Backlog",
                sprint: "Sprint 5",
                dueDate: "2026-06-15",
                createdDate: "May 18, 2026",
                labels: ["Documentation", "UX"],
                description: "Add keyboard navigation shortcuts for switching views, adding tasks, and searching backlog cards. Document these shortcuts in a modal.",
                subtasks: [
                    { id: "s1", title: "Draft documentation shortcut list", completed: true },
                    { id: "s2", title: "Implement shortcuts modal in AppHeader", completed: false },
                ],
                activities: []
            },
            {
                id: "eco-bl-5",
                flowId: "FLOW-054",
                title: "Mobile responsive kanban board",
                priority: "medium",
                assigneeName: "Meera Joshi",
                assigneeInitials: "MJ",
                assigneeColor: ASSIGNEE_STYLE,
                points: 5,
                status: "Backlog",
                sprint: "Sprint 4",
                dueDate: "2026-05-30",
                createdDate: "May 19, 2026",
                labels: ["UX", "Responsiveness"],
                description: "Ensure that board columns can stack or be swiped horizontally on screen sizes below 768px without breaking layout constraints.",
                subtasks: [
                    { id: "s1", title: "Add horizontal swiping on mobile view", completed: false },
                    { id: "s2", title: "Test layout rendering on iOS Safari", completed: false },
                ],
                activities: []
            },
            {
                id: "eco-bl-6",
                flowId: "FLOW-055",
                title: "Rate limiting middleware for API routes",
                priority: "high",
                assigneeName: "Arjun Sharma",
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_STYLE,
                points: 3,
                status: "Backlog",
                sprint: "Sprint 4",
                dueDate: "2026-05-28",
                createdDate: "May 20, 2026",
                labels: ["Security", "API"],
                description: "Protect internal API routes against DDOS and automated scrapers by introducing token bucket rate limiting on request headers.",
                subtasks: [
                    { id: "s1", title: "Evaluate rate-limiter libraries", completed: true },
                    { id: "s2", title: "Implement Redis-backed rate-limiter", completed: false },
                ],
                activities: []
            }
        ]
    },
    mobile: {
        projectId: "mobile",
        projectName: "Mobile App v2",
        tasks: [
            {
                id: "mob-bl-1",
                flowId: "FLOW-090",
                title: "Setup push notifications fallback channels",
                priority: "high",
                assigneeName: "Priya Singh",
                assigneeInitials: "PS",
                assigneeColor: ASSIGNEE_STYLE,
                points: 5,
                status: "Backlog",
                sprint: "Sprint 2",
                dueDate: "2026-05-29",
                createdDate: "May 12, 2026",
                labels: ["Mobile", "Notifications"],
                description: "Provide SMS or Email fallback channels when APNS or FCM push notifications fail or are disabled by user settings.",
                subtasks: [
                    { id: "s1", title: "Check device delivery receipts", completed: false },
                    { id: "s2", title: "Integrate Twilio fallback channel", completed: false }
                ],
                activities: []
            },
            {
                id: "mob-bl-2",
                flowId: "FLOW-091",
                title: "Configure App Store app review prompt",
                priority: "low",
                assigneeName: "Rahul Kumar",
                assigneeInitials: "RK",
                assigneeColor: ASSIGNEE_STYLE,
                points: 2,
                status: "Backlog",
                sprint: "Sprint 3",
                dueDate: "2026-06-05",
                createdDate: "May 13, 2026",
                labels: ["App Store", "Feedback"],
                description: "Prompt users for store rating reviews using Apple / Google Play native dialogue after 5 successful checkouts.",
                subtasks: [
                    { id: "s1", title: "Implement criteria tracking trigger", completed: true },
                    { id: "s2", title: "Call native store dialog API", completed: false }
                ],
                activities: []
            }
        ]
    },
    design: {
        projectId: "design",
        projectName: "Design System",
        tasks: [
            {
                id: "des-bl-1",
                flowId: "FLOW-120",
                title: "Figma Variables migration for theme values",
                priority: "medium",
                assigneeName: "Arjun Sharma",
                assigneeInitials: "AS",
                assigneeColor: ASSIGNEE_STYLE,
                points: 5,
                status: "Backlog",
                sprint: "Sprint 1",
                dueDate: "2026-05-25",
                createdDate: "May 10, 2026",
                labels: ["Figma", "Themes"],
                description: "Migrate existing shadow and color styles into native Figma variables to support automated theme translation exporting.",
                subtasks: [
                    { id: "s1", title: "Review typography styles hierarchy", completed: false },
                    { id: "s2", title: "Map all base colors to variables", completed: false }
                ],
                activities: []
            }
        ]
    }
}
