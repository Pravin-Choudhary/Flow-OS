"use client"

import React from "react"
import { useDashboardNav } from "@/components/dasboard/dashboard-nav-context"
import { projectsData, getMemberGradient } from "@/components/dasboard/dashboard-content"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Users, UserPlus, Search, ArrowLeft } from "lucide-react"

interface MembersViewProps {
    projectId: string
}

export function MembersView({ projectId }: MembersViewProps) {
    const { setActiveView } = useDashboardNav()
    const [searchQuery, setSearchQuery] = React.useState("")

    const activeProject = React.useMemo(() => {
        return projectsData.find((p) => p.id === projectId) || projectsData[0]
    }, [projectId])

    const filteredMembers = React.useMemo(() => {
        if (!searchQuery.trim()) return activeProject.members
        const query = searchQuery.toLowerCase()
        return activeProject.members.filter(
            (m) =>
                m.name.toLowerCase().includes(query) ||
                m.designation.toLowerCase().includes(query) ||
                m.task.toLowerCase().includes(query)
        )
    }, [activeProject.members, searchQuery])

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
            {/* ─── Page Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/40 pb-6">
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={() => setActiveView("dashboard")}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 w-fit outline-none"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className={cn("size-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary")}>
                            <Users className="size-4.5" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {activeProject.name} Team
                        </h1>
                    </div>
                    <p className="text-xs text-muted-foreground ml-11">
                        Manage roles, bios, and key responsibilities for this project ({activeProject.members.length} members).
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 md:ml-11">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-9 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    {/* Invite Button */}
                    <button className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 h-9 rounded-xl shadow-xs w-full sm:w-auto">
                        <UserPlus className="size-3.5" />
                        Add Member
                    </button>
                </div>
            </div>

            {/* ─── Members Cards Grid ─── */}
            {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member, mIdx) => {
                        const gradientClass = getMemberGradient(member.name)
                        const initial = member.name.charAt(0).toUpperCase()

                        return (
                            <Card
                                key={mIdx}
                                className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 hover:border-zinc-350 dark:hover:border-zinc-700/60 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                            >
                                <CardContent className="p-6 flex flex-col gap-4">
                                    {/* Header: Avatar, Name, Designation */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3.5">
                                            {member.avatarUrl ? (
                                                <Avatar className="size-12 ring-2 ring-background shadow-xs">
                                                    <AvatarFallback className="font-bold text-sm bg-muted">
                                                        {initial}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div
                                                    className={cn(
                                                        "size-12 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-background select-none",
                                                        gradientClass
                                                    )}
                                                >
                                                    {initial}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-[15px]">
                                                    {member.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">
                                                    {member.dateRange}
                                                </span>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className="bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full select-none shrink-0"
                                        >
                                            {member.designation}
                                        </Badge>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal min-h-[48px]">
                                        {member.bio}
                                    </p>
                                </CardContent>

                                {/* Task Section */}
                                <div className="px-6 py-4 bg-zinc-100/40 dark:bg-zinc-950/20 border-t border-zinc-200/40 dark:border-zinc-800/30 flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Focusing on
                                    </span>
                                    <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 bg-zinc-200/50 dark:bg-zinc-800/60 px-2.5 py-0.5 rounded-full truncate max-w-[70%]">
                                        {member.task}
                                    </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl mt-4">
                    <p className="text-sm text-muted-foreground">No members found matching &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-primary font-medium hover:underline mt-2"
                    >
                        Clear search filter
                    </button>
                </div>
            )}
        </div>
    )
}
