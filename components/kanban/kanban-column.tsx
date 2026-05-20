"use client"

import { cn } from "@/lib/utils"
import {
    KanbanColumn as KanbanColumnPrimitive,
    KanbanColumnContent,
    KanbanColumnHandle,
} from "@/components/reui/kanban"
import { KanbanCard } from "./kanban-card"
import type { KanbanTask } from "./kanban-data"
import { COLUMN_META } from "./kanban-data"
import { GripVertical } from "lucide-react"

interface KanbanColumnProps {
    columnId: string
    tasks: KanbanTask[]
    isOverlay?: boolean
}

export function KanbanColumn({ columnId, tasks, isOverlay }: KanbanColumnProps) {
    const meta = COLUMN_META[columnId] ?? {
        label: columnId,
        color: "text-foreground",
        dot: "bg-foreground",
    }

    return (
        <KanbanColumnPrimitive value={columnId}>
            <div
                className={cn(
                    "flex flex-col gap-3 rounded-2xl",
                    "bg-zinc-50/60 dark:bg-zinc-900/40",
                    "border border-zinc-200/70 dark:border-zinc-800/60",
                    "p-3",
                    "min-h-[200px]",
                    isOverlay && "opacity-60"
                )}
            >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 py-0.5">
                    <div className="flex items-center gap-2">
                        {/* Status dot */}
                        <span className={cn("size-2 rounded-full shrink-0", meta.dot)} />
                        {/* Column Label */}
                        <span className={cn("text-xs font-semibold uppercase tracking-wider", meta.color)}>
                            {meta.label}
                        </span>
                        {/* Task count badge */}
                        <span className="inline-flex items-center justify-center size-5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/60 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                            {tasks.length}
                        </span>
                    </div>

                    {/* Drag handle for column */}
                    <KanbanColumnHandle
                        render={(props) => (
                            <button
                                {...props}
                                className={cn(
                                    "p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground",
                                    "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/40",
                                    "transition-colors opacity-0 group-hover/kanban-column:opacity-100",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                )}
                                aria-label="Drag column"
                            >
                                <GripVertical className="size-3.5" />
                            </button>
                        )}
                    />
                </div>

                {/* Cards */}
                <KanbanColumnContent
                    value={columnId}
                    className="flex flex-col gap-2"
                >
                    {tasks.map((task) => (
                        <KanbanCard key={task.id} task={task} isOverlay={isOverlay} />
                    ))}
                </KanbanColumnContent>

                {/* Empty state */}
                {tasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-xs text-muted-foreground/50 italic">No tasks yet</p>
                    </div>
                )}
            </div>
        </KanbanColumnPrimitive>
    )
}
