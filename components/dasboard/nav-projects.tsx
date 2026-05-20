"use client"

import { useState } from "react"
import { ChevronRight, Plus, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useDashboardNav } from "./dashboard-nav-context"
import { cn } from "@/lib/utils"

interface Project {
    name: string
    url: string
    color: string
    isExpanded: boolean
    projectId: string
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
        viewType?: "board" | "backlog" | "members" | "analytics" | "default"
    }[]
}

export function NavProjects({
    projects: initialProjects,
}: {
    projects: Project[]
}) {
    const [projects, setProjects] = useState(initialProjects)
    const { navigateToBoard, navigateToBacklog, navigateToMembers, navigateToAnalytics, activeView, activeProjectId } = useDashboardNav()

    const toggleProject = (index: number) => {
        setProjects((prev) =>
            prev.map((p, i) => (i === index ? { ...p, isExpanded: !p.isExpanded } : p))
        )
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between px-2 mb-1.5">
                <SidebarGroupLabel className="m-0 text-xs font-semibold text-muted-foreground/80">Projects</SidebarGroupLabel>
            </div>
            <SidebarMenu className="gap-1">
                {projects.map((project, index) => (
                    <Collapsible
                        key={project.name}
                        open={project.isExpanded}
                        onOpenChange={() => toggleProject(index)}
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger
                                render={
                                    <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent/50 group/collapsible">
                                        <div className="flex items-center gap-2.5">
                                            {/* Colored dot */}
                                            <span className={`size-2.5 rounded-full shrink-0 ${project.color}`} />
                                            <span className="font-medium text-sm truncate">{project.name}</span>
                                        </div>
                                        <ChevronRight className="ml-auto size-4 text-muted-foreground/60 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                }
                            />
                            <CollapsibleContent>
                                <SidebarMenuSub className="border-l border-zinc-200 dark:border-zinc-800 ml-3.5 pl-2.5 gap-0.5 mt-0.5">
                                    {project.items.length > 0 ? (
                                        project.items.map((item) => {
                                            const isBoardItem = item.viewType === "board"
                                            const isBacklogItem = item.viewType === "backlog"
                                            const isMembersItem = item.viewType === "members"
                                            const isAnalyticsItem = item.viewType === "analytics"
                                            const isActiveItem =
                                                (isBoardItem && activeView === "board" && activeProjectId === project.projectId) ||
                                                (isBacklogItem && activeView === "backlog" && activeProjectId === project.projectId) ||
                                                (isMembersItem && activeView === "members" && activeProjectId === project.projectId) ||
                                                (isAnalyticsItem && activeView === "analytics" && activeProjectId === project.projectId)

                                            return (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton
                                                        isActive={isActiveItem || item.isActive}
                                                        render={
                                                            <button
                                                                className={cn(
                                                                    "flex items-center gap-2 w-full text-left",
                                                                    isActiveItem && "text-foreground font-medium"
                                                                )}
                                                                onClick={() => {
                                                                    if (isBoardItem) {
                                                                        navigateToBoard(project.projectId)
                                                                    } else if (isBacklogItem) {
                                                                        navigateToBacklog(project.projectId)
                                                                    } else if (isMembersItem) {
                                                                        navigateToMembers(project.projectId)
                                                                    } else if (isAnalyticsItem) {
                                                                        navigateToAnalytics(project.projectId)
                                                                    }
                                                                }}
                                                            >
                                                                <item.icon className="size-3.5 text-muted-foreground/80" />
                                                                <span>{item.title}</span>
                                                            </button>
                                                        }
                                                    />
                                                </SidebarMenuSubItem>
                                            )
                                        })
                                    ) : (
                                        <div className="text-[11px] text-muted-foreground/60 py-1 pl-2.5 italic">
                                            No active views
                                        </div>
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}

                {/* Add new project */}
                <SidebarMenuItem>
                    <SidebarMenuButton
                        className="text-muted-foreground/80 hover:text-foreground mt-1"
                        render={
                            <button className="flex items-center gap-2 w-full">
                                <Plus className="size-4" />
                                <span className="text-xs">New project</span>
                            </button>
                        }
                    />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}