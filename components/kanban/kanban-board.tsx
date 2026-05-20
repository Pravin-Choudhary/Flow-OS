"use client"

import { useState } from "react"
import {
    Kanban,
    KanbanBoard,
    KanbanOverlay,
} from "@/components/reui/kanban"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import type { KanbanTask } from "./kanban-data"
import { PROJECT_BOARDS } from "./kanban-data"
import { cn } from "@/lib/utils"
import { Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardNav } from "@/components/dasboard/dashboard-nav-context"

interface KanbanBoardViewProps {
    projectId: string
}

export function KanbanBoardView({ projectId }: KanbanBoardViewProps) {
    const projectData = PROJECT_BOARDS[projectId] ?? PROJECT_BOARDS["ecommerce"]
    const { setIsNewTaskOpen } = useDashboardNav()

    const [columns, setColumns] = useState<Record<string, KanbanTask[]>>(
        projectData.columns
    )

    // Reset columns when projectId changes — handled via key prop on parent
    const columnIds = Object.keys(columns)

    // Find the active dragging task for overlay
    const findTask = (id: string): KanbanTask | undefined => {
        for (const col of Object.values(columns)) {
            const found = col.find((t) => t.id === id)
            if (found) return found
        }
        return undefined
    }

    return (
        <div className="flex flex-col gap-5 p-5 md:p-6 min-h-full">
            {/* ─── Sprint Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        {projectData.projectName}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {projectData.sprintName} &middot; {projectData.sprintDates}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                        <Zap className="size-3.5 text-muted-foreground" />
                        Sprint Actions
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs h-8 cursor-pointer" onClick={() => setIsNewTaskOpen(true)}>
                        <Plus className="size-3.5" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* ─── Sprint Health Bar (Minimal Monochromatic style) ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-xl border border-zinc-200/70 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-3">
                {/* Health progress */}
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Sprint Health
                    </span>
                    <div className="flex-1 max-w-[160px] h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all bg-zinc-800 dark:bg-zinc-200"
                            style={{ width: `${projectData.sprintHealth}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold tabular-nums text-foreground">
                        {projectData.sprintHealth}/100
                    </span>
                </div>

                {/* Status counts */}
                <div className="flex items-center gap-4 flex-wrap">
                    <StatusDot color="bg-zinc-800 dark:bg-zinc-200" label={`${projectData.doneTasks} Done`} />
                    <StatusDot color="bg-zinc-500 dark:bg-zinc-400" label={`${projectData.inProgressTasks} In Progress`} />
                    <StatusDot color="bg-zinc-400 dark:bg-zinc-500" label={`${projectData.reviewTasks} Review`} />
                    <StatusDot color="bg-zinc-300 dark:bg-zinc-650" label={`${projectData.blockedTasks} Blocked`} />
                </div>
            </div>

            {/* ─── Kanban Board ─── */}
            <div className="flex-1 overflow-x-auto">
                <Kanban
                    value={columns}
                    onValueChange={setColumns}
                    getItemValue={(item) => item.id}
                >
                    <KanbanBoard className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 auto-rows-auto min-w-[320px]">
                        {columnIds.map((colId) => (
                            <KanbanColumn
                                key={colId}
                                columnId={colId}
                                tasks={columns[colId]}
                            />
                        ))}
                    </KanbanBoard>

                    {/* Drag overlay */}
                    <KanbanOverlay>
                        {({ value }) => {
                            const task = findTask(value as string)
                            return task ? <KanbanCard task={task} isOverlay /> : null
                        }}
                    </KanbanOverlay>
                </Kanban>
            </div>
        </div>
    )
}

// ─── Small helper ───
function StatusDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", color)} />
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                {label}
            </span>
        </div>
    )
}
