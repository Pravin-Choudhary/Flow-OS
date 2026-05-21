"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { KanbanItem, KanbanItemHandle } from "@/components/reui/kanban"
import type { KanbanTask, TaskPriority } from "./kanban-data"

// ─── Priority configuration (Minimal Theme) ───
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
    urgent: {
        label: "Urgent",
        className: "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent",
    },
    high: {
        label: "High",
        className: "bg-zinc-200/60 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700",
    },
    medium: {
        label: "Med",
        className: "bg-zinc-100 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800",
    },
    low: {
        label: "Low",
        className: "bg-zinc-50 dark:bg-zinc-950/20 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-900",
    },
}

interface KanbanCardProps {
    task: KanbanTask
    isOverlay?: boolean
}

export function KanbanCard({ task, isOverlay }: KanbanCardProps) {
    const priority = PRIORITY_CONFIG[task.priority]

    const cardContent = (
        <div
            className={cn(
                "group relative flex flex-col gap-2.5 rounded-xl border bg-card px-3.5 py-3 shadow-xs",
                "border-zinc-200/80 dark:border-zinc-800/80",
                "hover:border-zinc-300/80 dark:hover:border-zinc-700/80",
                "hover:shadow-sm transition-all duration-150",
                isOverlay && "rotate-1 scale-105 shadow-xl opacity-95"
            )}
        >
            {/* Task ID */}
            <span className="text-[10px] font-semibold text-muted-foreground/60 tracking-widest uppercase leading-none">
                {task.flowId}
            </span>

            {/* Title */}
            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                {task.title}
            </p>

            {/* Footer: Priority + Points + Assignee */}
            <div className="flex items-center gap-2 mt-0.5">
                {/* Priority badge */}
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border leading-none",
                        priority.className
                    )}
                >
                    {priority.label}
                </span>

                {/* Story points */}
                <span className="text-[10px] text-muted-foreground font-medium">
                    {task.points} pts
                </span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Assignee avatar */}
                <Avatar className="size-6 ring-2 ring-background">
                    <AvatarFallback className={cn("text-[10px] font-semibold flex items-center justify-center w-full h-full", task.assigneeColor)}>
                        {task.assigneeInitials}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )

    return (
        <KanbanItem value={task.id}>
            {!isOverlay ? (
                <KanbanItemHandle>{cardContent}</KanbanItemHandle>
            ) : (
                cardContent
            )}
        </KanbanItem>
    )
}
