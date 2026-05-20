"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Drawer,
    DrawerContent,
    DrawerClose,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Filter,
    Plus,
    ArrowRight,
    ArrowLeft,
    Calendar,
    Trash2,
    MessageSquare,
    Check,
    X,
    ChevronDown,
    PlusCircle,
} from "lucide-react"
import { PROJECT_BACKLOGS, type BacklogTask } from "./backlog-data"
import { cn } from "@/lib/utils"

interface BacklogViewProps {
    projectId: string
}

export function BacklogView({ projectId }: BacklogViewProps) {
    const projectData = PROJECT_BACKLOGS[projectId] ?? PROJECT_BACKLOGS["ecommerce"]

    const [tasks, setTasks] = useState<BacklogTask[]>(projectData.tasks)
    const [selectedTask, setSelectedTask] = useState<BacklogTask | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [newCommentText, setNewCommentText] = useState("")

    // Handle priority styling
    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent"
            case "high":
                return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
            case "medium":
                return "bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-200/60 dark:border-zinc-800/80"
            case "low":
                return "bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-500 dark:text-zinc-500 border-zinc-100 dark:border-zinc-900/60"
            default:
                return "bg-transparent text-zinc-400 dark:text-zinc-600 border border-zinc-250 dark:border-zinc-800"
        }
    }

    const handleRowClick = (task: BacklogTask) => {
        setSelectedTask(task)
        setIsDrawerOpen(true)
    }

    // Toggle subtask completion
    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        const updatedTasks = tasks.map((t) => {
            if (t.id === taskId) {
                const updatedSubtasks = t.subtasks.map((st) => {
                    if (st.id === subtaskId) {
                        return { ...st, completed: !st.completed }
                    }
                    return st
                })
                return { ...t, subtasks: updatedSubtasks }
            }
            return t
        })
        setTasks(updatedTasks)

        // Keep selected task in sync
        if (selectedTask && selectedTask.id === taskId) {
            const currentTask = updatedTasks.find((t) => t.id === taskId)
            if (currentTask) setSelectedTask(currentTask)
        }
    }

    // Add new comment
    const handleAddComment = () => {
        if (!newCommentText.trim() || !selectedTask) return

        const newComment = {
            id: `act-${Date.now()}`,
            author: "Arjun Sharma",
            authorInitials: "AS",
            authorColor: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700",
            comment: newCommentText.trim(),
            timeAgo: "Just now",
        }

        const updatedTasks = tasks.map((t) => {
            if (t.id === selectedTask.id) {
                return {
                    ...t,
                    activities: [newComment, ...t.activities],
                }
            }
            return t
        })

        setTasks(updatedTasks)
        setNewCommentText("")

        const currentTask = updatedTasks.find((t) => t.id === selectedTask.id)
        if (currentTask) setSelectedTask(currentTask)
    }

    // Delete task
    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId))
        setIsDrawerOpen(false)
        setSelectedTask(null)
    }

    // Update task dropdown options (status, priority, points)
    const handleUpdateTaskField = (taskId: string, field: keyof BacklogTask, value: string | number) => {
        const updatedTasks = tasks.map((t) => {
            if (t.id === taskId) {
                return { ...t, [field]: value as any }
            }
            return t
        })
        setTasks(updatedTasks)

        if (selectedTask && selectedTask.id === taskId) {
            const currentTask = updatedTasks.find((t) => t.id === taskId)
            if (currentTask) setSelectedTask(currentTask)
        }
    }

    // Add Task helper
    const handleAddTask = () => {
        const newTaskId = `eco-bl-${Date.now()}`
        const nextFlowNum = tasks.length > 0 
            ? Math.max(...tasks.map(t => parseInt(t.flowId.replace("FLOW-", "")))) + 1 
            : 50
        const flowIdStr = `FLOW-${String(nextFlowNum).padStart(3, "0")}`

        const newTask: BacklogTask = {
            id: newTaskId,
            flowId: flowIdStr,
            title: "New unplanned backlog item",
            priority: "medium",
            assigneeName: "Arjun Sharma",
            assigneeInitials: "AS",
            assigneeColor: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/85",
            points: 3,
            status: "Backlog",
            sprint: "Sprint 4",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            labels: ["Sprint Backlog"],
            description: "Describe the requirements, edge cases, and engineering guidelines here.",
            subtasks: [
                { id: "s1", title: "Refined requirements checklist", completed: false }
            ],
            activities: []
        }

        setTasks([...tasks, newTask])
    }

    return (
        <div className="flex flex-col gap-6 p-5 md:p-6 min-h-full">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Backlog</h1>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {tasks.length} unplanned tasks
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-zinc-200/80 dark:border-zinc-800/80">
                        <Filter className="size-3.5" />
                        Filter
                    </Button>
                    <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleAddTask}>
                        <Plus className="size-3.5" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800/60 overflow-hidden bg-card shadow-xs">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
                        <TableRow className="hover:bg-transparent border-zinc-200/80 dark:border-zinc-800/80">
                            <TableHead className="w-[50%] font-bold text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">TASK</TableHead>
                            <TableHead className="font-bold text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">PRIORITY</TableHead>
                            <TableHead className="font-bold text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">ASSIGNEE</TableHead>
                            <TableHead className="font-bold text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">POINTS</TableHead>
                            <TableHead className="text-right font-bold text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TableRow
                                    key={task.id}
                                    className="cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-zinc-200/80 dark:border-zinc-800/80 transition-colors"
                                    onClick={() => handleRowClick(task)}
                                >
                                    <TableCell className="py-3.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider font-mono">
                                                {task.flowId}
                                            </span>
                                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">
                                                {task.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border leading-none",
                                            getPriorityStyles(task.priority)
                                        )}>
                                            {task.priority === "none" ? "None" : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Avatar className="size-5.5 ring-2 ring-background shrink-0">
                                                <AvatarFallback className={cn("text-[9px] font-semibold flex items-center justify-center w-full h-full", task.assigneeColor)}>
                                                    {task.assigneeInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                                                {task.assigneeName.split(" ")[0]}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold font-mono">
                                        {task.points} {task.points === 1 ? "pt" : "pts"}
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[11px] gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400 font-semibold border-zinc-200/80 dark:border-zinc-800/80 px-2.5 rounded-lg inline-flex items-center"
                                            onClick={() => handleRowClick(task)}
                                        >
                                            <ArrowLeft className="size-3 shrink-0" />
                                            Sprint
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground">
                                    No tasks in backlog. Click &quot;+ Add Task&quot; to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Drawer details */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                {selectedTask && (
                    <DrawerContent className="data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[95vw] data-[vaul-drawer-direction=right]:sm:max-w-[1000px] border-l border-border p-0 flex flex-row h-full bg-background rounded-l-2xl overflow-hidden before:hidden">
                        <DrawerTitle className="sr-only">Task Details</DrawerTitle>
                        
                        {/* Close Button */}
                        <DrawerClose className="absolute top-6 right-6 z-50 rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                            <X className="size-5" />
                        </DrawerClose>

                        {/* Left Pane (Main Details) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 sm:p-12 space-y-12 border-r border-zinc-200 dark:border-zinc-800/60">
                            
                            {/* Header */}
                            <div>
                                <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest font-mono uppercase mb-3">
                                    {selectedTask.flowId}
                                </div>
                                <input
                                    type="text"
                                    value={selectedTask.title}
                                    onChange={(e) => handleUpdateTaskField(selectedTask.id, "title", e.target.value)}
                                    className="w-full text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none p-0 focus:outline-none focus:ring-0 select-text leading-tight"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                                    Description
                                </h4>
                                <textarea
                                    value={selectedTask.description}
                                    onChange={(e) => handleUpdateTaskField(selectedTask.id, "description", e.target.value)}
                                    className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-transparent border-none p-0 resize-none focus:outline-none focus:ring-0 min-h-[120px] leading-relaxed"
                                    placeholder="Add a description..."
                                />
                            </div>

                            {/* Subtasks */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                                        Subtasks
                                    </h4>
                                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 font-mono">
                                        {selectedTask.subtasks.filter(s => s.completed).length} / {selectedTask.subtasks.length}
                                    </span>
                                </div>

                                <Progress
                                    value={
                                        selectedTask.subtasks.length > 0
                                            ? (selectedTask.subtasks.filter(s => s.completed).length / selectedTask.subtasks.length) * 100
                                            : 0
                                    }
                                    className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full [&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-500"
                                />

                                <div className="space-y-2 mt-4">
                                    {selectedTask.subtasks.map((st) => (
                                        <div
                                            key={st.id}
                                            className="flex items-center gap-3.5 py-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                                            onClick={() => handleToggleSubtask(selectedTask.id, st.id)}
                                        >
                                            <Checkbox
                                                checked={st.completed}
                                                onCheckedChange={() => handleToggleSubtask(selectedTask.id, st.id)}
                                                className="size-5 rounded border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 dark:data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:border-emerald-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className={cn(
                                                "text-sm font-medium transition-all leading-none",
                                                st.completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-700 dark:text-zinc-300"
                                            )}>
                                                {st.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity & Comments */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-2">
                                    <MessageSquare className="size-4" />
                                    Activity & comments
                                </h4>

                                <div className="flex gap-4 items-start">
                                    <Avatar className="size-8 shrink-0 ring-2 ring-background">
                                        <AvatarFallback className="text-[10px] font-bold bg-zinc-100 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
                                            AS
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 flex gap-3 items-center">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                            className="flex-1 text-sm bg-zinc-100 dark:bg-[#161616] border-none rounded-full px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                                        />
                                        <Button 
                                            className="h-10 px-6 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                                            onClick={handleAddComment}
                                        >
                                            Comment
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    {selectedTask.activities.map((act) => (
                                        <div key={act.id} className="flex gap-4">
                                            <Avatar className="size-8 shrink-0 ring-2 ring-background">
                                                <AvatarFallback className={cn("text-[10px] font-bold border border-zinc-200/50 dark:border-zinc-800/50", act.authorColor)}>
                                                    {act.authorInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{act.author}</span>
                                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{act.timeAgo}</span>
                                                </div>
                                                <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-transparent border-none p-0">
                                                    {act.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Pane (Sidebar Details) */}
                        <div className="w-[320px] shrink-0 overflow-y-auto no-scrollbar p-8 pt-20 flex flex-col space-y-8 bg-zinc-50/50 dark:bg-transparent">
                            
                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Status</label>
                                <div className="relative w-full">
                                    <select
                                        value={selectedTask.status}
                                        onChange={(e) => handleUpdateTaskField(selectedTask.id, "status", e.target.value)}
                                        className="flex w-full appearance-none items-center justify-between rounded-3xl border border-transparent bg-input/50 pl-3 pr-8 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground h-10 cursor-pointer focus:outline-none focus:ring-3 focus:ring-ring/30 focus:border-ring font-medium"
                                    >
                                        {["Backlog", "In Progress", "Review", "Done"].map((opt) => (
                                            <option key={opt} className="bg-background text-foreground font-medium" value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="size-4 text-muted-foreground opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Priority</label>
                                <div className="relative w-full">
                                    <select
                                        value={selectedTask.priority}
                                        onChange={(e) => handleUpdateTaskField(selectedTask.id, "priority", e.target.value)}
                                        className="flex w-full appearance-none items-center justify-between rounded-3xl border border-transparent bg-input/50 pl-3 pr-8 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground h-10 cursor-pointer focus:outline-none focus:ring-3 focus:ring-ring/30 focus:border-ring font-medium capitalize"
                                    >
                                        {["none", "low", "medium", "high", "urgent"].map((opt) => (
                                            <option key={opt} className="bg-background text-foreground font-medium capitalize" value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="size-4 text-muted-foreground opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {/* Assignee */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Assignee</label>
                                <div className="flex w-full items-center gap-2.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm transition-[color,box-shadow,background-color] hover:bg-input/80 h-10 cursor-pointer">
                                    <Avatar className="size-6 shrink-0 ring-1 ring-background">
                                        <AvatarFallback className={cn("text-[9px] font-bold", selectedTask.assigneeColor)}>
                                            {selectedTask.assigneeInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">
                                        {selectedTask.assigneeName}
                                    </span>
                                </div>
                            </div>

                            {/* Sprint */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Sprint</label>
                                <div className="flex w-full items-center rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm font-medium transition-[color,box-shadow,background-color] hover:bg-input/80 h-10 cursor-pointer">
                                    {selectedTask.sprint}
                                </div>
                            </div>



                            {/* Due Date */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Due Date</label>
                                <div className="flex w-full items-center justify-between rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm transition-[color,box-shadow,background-color] focus-within:ring-3 focus-within:ring-ring/30 focus-within:border-ring h-10 relative cursor-text">
                                    <input
                                        type="date"
                                        value={selectedTask.dueDate}
                                        onChange={(e) => handleUpdateTaskField(selectedTask.id, "dueDate", e.target.value)}
                                        className="w-full font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10"
                                    />
                                    <Calendar className="size-4 text-muted-foreground shrink-0 pointer-events-none absolute right-3" />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center justify-between">
                                    Labels
                                    <PlusCircle className="size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTask.labels.map((lbl) => (
                                        <Badge
                                            key={lbl}
                                            variant="secondary"
                                            className="text-[11px] px-2.5 py-1 rounded-md border-transparent font-medium"
                                        >
                                            {lbl}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Metadata & Actions */}
                            <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800/60 space-y-6">
                                <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 dark:text-zinc-400 px-1">
                                    <span>Created</span>
                                    <span>{selectedTask.createdDate}</span>
                                </div>

                                <Button
                                    variant="destructive"
                                    className="w-full h-11 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-none font-bold rounded-xl"
                                    onClick={() => handleDeleteTask(selectedTask.id)}
                                >
                                    <Trash2 className="size-4 mr-2" />
                                    Delete Task
                                </Button>
                            </div>

                        </div>
                    </DrawerContent>
                )}
            </Drawer>
        </div>
    )
}
