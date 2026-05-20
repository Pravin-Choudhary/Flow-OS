"use client"

import { useState } from "react"
import { ChevronRight, Folder, Plus, MoreHorizontal, type LucideIcon } from "lucide-react"

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
    SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Project {
    name: string
    url: string
    color: string
    isExpanded: boolean
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
    }[]
}

export function NavProjects({
    projects: initialProjects,
}: {
    projects: Project[]
}) {
    const [projects, setProjects] = useState(initialProjects)

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
                                            {/* Colored dot — NEVER white */}
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
                                        project.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton
                                                    isActive={item.isActive}
                                                    render={
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="size-3.5 text-muted-foreground/80" />
                                                            <span>{item.title}</span>
                                                        </a>
                                                    }
                                                />
                                            </SidebarMenuSubItem>
                                        ))
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
