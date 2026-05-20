"use client"

import React from "react"
import { useDashboardNav } from "./dashboard-nav-context"
import { projectsData, getMemberGradient } from "@/components/dasboard/dashboard-content"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function TeamView() {
    const { setActiveView } = useDashboardNav()
    const [searchQuery, setSearchQuery] = React.useState("")

    // Consolidate all members across all projects + include the workspace admin
    const allMembers = React.useMemo(() => {
        const membersMap = new Map<string, {
            name: string
            email: string
            designation: string
            bio: string
            projects: string[]
            task: string
            dateRange: string
        }>()

        // Add default admin
        membersMap.set("Arjun Sharma", {
            name: "Arjun Sharma",
            email: "arjun@flowos.dev",
            designation: "Admin",
            bio: "Principal Product Architect & Workspace Owner. Guides cross-functional platform efforts and coordinates sprint releases.",
            projects: ["Workspace Admin"],
            task: "Platform Strategy",
            dateRange: "Jan 2025 - Present"
        })

        // Add members from projectsData
        projectsData.forEach((project) => {
            project.members.forEach((member) => {
                const existing = membersMap.get(member.name)
                if (existing) {
                    if (!existing.projects.includes(project.name)) {
                        existing.projects.push(project.name)
                    }
                } else {
                    membersMap.set(member.name, {
                        name: member.name,
                        email: `${member.name.toLowerCase().replace(/\s+/g, ".")}@flowos.dev`,
                        designation: member.designation,
                        bio: member.bio,
                        projects: [project.name],
                        task: member.task,
                        dateRange: member.dateRange
                    })
                }
            })
        })

        return Array.from(membersMap.values())
    }, [])

    const filteredMembers = React.useMemo(() => {
        if (!searchQuery.trim()) return allMembers
        const query = searchQuery.toLowerCase()
        return allMembers.filter(
            (m) =>
                m.name.toLowerCase().includes(query) ||
                m.designation.toLowerCase().includes(query) ||
                m.projects.some((p) => p.toLowerCase().includes(query)) ||
                m.task.toLowerCase().includes(query)
        )
    }, [allMembers, searchQuery])

    return (
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
            {/* ─── Page Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/40 pb-8">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveView("dashboard")}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 w-fit outline-none cursor-pointer"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                            <Users className="size-5" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Workspace Team
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-12">
                        Meet the cross-functional team members collaborating on FlowOS projects ({allMembers.length} members total).
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 md:ml-12">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search members, roles, projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* ─── Members Cards Grid ─── */}
            {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredMembers.map((member, mIdx) => {
                        const gradientClass = getMemberGradient(member.name)
                        const initial = member.name.charAt(0).toUpperCase()

                        return (
                            <Card
                                key={mIdx}
                                className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 hover:border-zinc-350 dark:hover:border-zinc-700/60 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                            >
                                <CardContent className="p-6 flex flex-col gap-4">
                                    {/* Header: Avatar + Name + Designation */}
                                    <div className="flex items-start gap-3.5">
                                        <div
                                            className={cn(
                                                "size-12 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-base shadow-inner ring-2 ring-background select-none shrink-0",
                                                gradientClass
                                            )}
                                        >
                                            {initial}
                                        </div>
                                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-[15px] leading-snug truncate">
                                                {member.name}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground truncate">
                                                {member.email}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="w-fit mt-1 bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full select-none"
                                            >
                                                {member.designation}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal min-h-[52px] line-clamp-3">
                                        {member.bio}
                                    </p>

                                    {/* Projects */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {member.projects.map((proj, pIdx) => (
                                            <Badge
                                                key={pIdx}
                                                variant="outline"
                                                className="text-[10px] font-medium border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-100/30 dark:bg-zinc-900/30 px-2.5 py-0.5 rounded-full"
                                            >
                                                {proj}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                {/* Task Footer */}
                                <div className="px-6 py-4 bg-zinc-100/40 dark:bg-zinc-950/20 border-t border-zinc-200/40 dark:border-zinc-800/30 flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none shrink-0">
                                        Focus
                                    </span>
                                    <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                        {member.task}
                                    </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl mt-4">
                    <p className="text-sm text-muted-foreground">No team members found matching &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-primary font-medium hover:underline mt-2 cursor-pointer"
                    >
                        Clear search filter
                    </button>
                </div>
            )}
        </div>
    )
}
