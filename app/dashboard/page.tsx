"use client"

import { AppSidebar } from "@/components/dasboard/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardContent } from "@/components/dasboard/dashboard-content"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardNavProvider, useDashboardNav } from "@/components/dasboard/dashboard-nav-context"
import { KanbanBoardView } from "@/components/kanban/kanban-board"

import { BacklogView } from "@/components/backlog/backlog-view"
import { MembersView } from "@/components/members/members-view"
import { AnalyticsView } from "@/components/analytics/analytics-view"

// ─── Inner content that consumes the nav context ───
function DashboardPageInner() {
    const { activeView, activeProjectId } = useDashboardNav()

    const breadcrumbPage =
        activeView === "board"
            ? "Board"
            : activeView === "backlog"
                ? "Backlog"
                : activeView === "members"
                    ? "Members"
                    : activeView === "analytics"
                        ? "Analytics"
                        : "Dashboard"

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    {activeView === "board" ? (
                        // Key ensures the board resets drag state when switching projects
                        <KanbanBoardView key={activeProjectId} projectId={activeProjectId} />
                    ) : activeView === "backlog" ? (
                        <BacklogView key={activeProjectId} projectId={activeProjectId} />
                    ) : activeView === "members" ? (
                        <MembersView key={activeProjectId} projectId={activeProjectId} />
                    ) : activeView === "analytics" ? (
                        <AnalyticsView key={activeProjectId} projectId={activeProjectId} />
                    ) : (
                        <DashboardContent />
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

// ─── Page root — wraps everything in the context provider ───
export default function DashboardPage() {
    return (
        <DashboardNavProvider>
            <DashboardPageInner />
        </DashboardNavProvider>
    )
}