"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Bell,
    Zap,
    BarChart3,
    Users,
    Settings,
    Kanban,
    ListTodo,
    Timer,
    UserCircle,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
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
    user: {
        name: "Arjun Sharma",
        email: "arjun@flowos.dev",
        avatar: "",
        role: "Admin",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            navAction: "dashboard" as const,
        },
        {
            title: "Notifications",
            url: "#",
            icon: Bell,
            badge: "4",
        },
    ],
    navViews: [
        {
            title: "Team",
            url: "#",
            icon: Users,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ],
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
                { title: "Sprints", url: "#", icon: Timer },
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
    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#" className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Zap className="size-4" />
                                </div>
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
                <NavMain items={data.navMain} label="Workspace" />
                <NavProjects projects={data.projects} />
                <NavMain items={data.navViews} label="Views" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}