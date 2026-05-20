"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Zap,
    BarChart3,
    Users,
    Settings,
    Kanban,
    ListTodo,
    Timer,
    UserCircle,
    MailOpen,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { FlowOSIcon } from "@/components/ui/logo"
import { useDashboardNav } from "./dashboard-nav-context"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    projects: [
        {
            name: "E-Commerce",
            url: "#",
            color: "bg-emerald-500",
            isExpanded: true,
            projectId: "ecommerce",
            items: [
                { title: "Board", url: "#", icon: Kanban, isActive: false, viewType: "board" as const },
                { title: "Backlog", url: "#", icon: ListTodo, isActive: false, viewType: "backlog" as const },
                { title: "Members", url: "#", icon: UserCircle, viewType: "members" as const },
                { title: "Analytics", url: "#", icon: BarChart3, viewType: "analytics" as const },
            ],
        },
        {
            name: "Mobile App v2",
            url: "#",
            color: "bg-blue-500",
            isExpanded: false,
            projectId: "mobile",
            items: [
                { title: "Board", url: "#", icon: Kanban, isActive: false, viewType: "board" as const },
                { title: "Backlog", url: "#", icon: ListTodo, isActive: false, viewType: "backlog" as const },
                { title: "Sprints", url: "#", icon: Timer },
                { title: "Members", url: "#", icon: UserCircle, viewType: "members" as const },
                { title: "Analytics", url: "#", icon: BarChart3, viewType: "analytics" as const },
            ],
        },
        {
            name: "Design System",
            url: "#",
            color: "bg-violet-500",
            isExpanded: false,
            projectId: "design",
            items: [
                { title: "Board", url: "#", icon: Kanban, isActive: false, viewType: "board" as const },
                { title: "Backlog", url: "#", icon: ListTodo, isActive: false, viewType: "backlog" as const },
                { title: "Sprints", url: "#", icon: Timer },
                { title: "Members", url: "#", icon: UserCircle, viewType: "members" as const },
                { title: "Analytics", url: "#", icon: BarChart3, viewType: "analytics" as const },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { currentUser, invitations } = useDashboardNav()

    const pendingCount = invitations.filter(inv => inv.status === "pending").length

    const navMainItems = [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            viewType: "dashboard" as const,
        },
        ...(currentUser.role !== "Admin"
            ? [
                {
                    title: "Invitation",
                    url: "#",
                    icon: MailOpen,
                    badge: pendingCount > 0 ? String(pendingCount) : undefined,
                    viewType: "invitations" as const,
                },
            ]
            : []),
    ]

    const navViewsItems = [
        {
            title: "Team",
            url: "#",
            icon: Users,
            viewType: "team" as const,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
            viewType: "settings" as const,
        },
    ]

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#" className="flex items-center gap-2">
                                <FlowOSIcon className="size-8 flex-shrink-0" />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">FlowOS</span>
                                    <span className="truncate text-xs text-muted-foreground">Beta</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} label="Workspace" />
                <NavProjects projects={data.projects} />
                <NavMain items={navViewsItems} label="Views" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={currentUser} />
            </SidebarFooter>
        </Sidebar>
    )
}