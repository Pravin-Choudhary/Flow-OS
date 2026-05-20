"use client"

import * as React from "react"
import { useState } from "react"
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Filter,
    MoreHorizontal,
    Plus,
    TrendingUp,
    Users,
    Zap,
    ChevronRight,
    BarChart3,
    LineChart as LineChartIcon,
    AreaChart as AreaChartIcon,
    RefreshCw,
    Clock,
    Laptop,
    Smartphone,
    LayoutGrid,
    Palette,
    Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Line,
    LineChart,
    Area,
    AreaChart,
} from "recharts"

// ─── Top Stats Data ───
const topStats = [
    {
        title: "Tasks Completed",
        value: "125,450",
        trend: "20%",
        trendUp: true,
        subtitle: "Tasks finished last month",
        dotColor: "bg-blue-500",
    },
    {
        title: "Tasks In Progress",
        value: "1,200",
        trend: "20%",
        trendUp: true,
        subtitle: "Currently being worked on",
        dotColor: "bg-violet-500",
    },
    {
        title: "Pending Approvals",
        value: "450",
        trend: "20%",
        trendUp: true,
        subtitle: "Tasks awaiting review",
        dotColor: "bg-amber-500",
    },
    {
        title: "Overdue Tasks",
        value: "12",
        trend: "20%",
        trendUp: false,
        subtitle: "Missed deadlines this month",
        dotColor: "bg-rose-500",
    },
    {
        title: "New Tasks Assigned",
        value: "980",
        trend: "20%",
        trendUp: true,
        subtitle: "Tasks assigned this month",
        dotColor: "bg-emerald-500",
    },
]

// ─── Monthly Productivity Data ───
const productivityData = [
    { month: "Jan", completed: 520, remaining: 320 },
    { month: "Feb", completed: 1280, remaining: 720 },
    { month: "Mar", completed: 980, remaining: 520 },
    { month: "Apr", completed: 1120, remaining: 480 },
    { month: "May", completed: 1580, remaining: 620 },
    { month: "Jun", completed: 920, remaining: 380 },
    { month: "Jul", completed: 780, remaining: 420 },
    { month: "Aug", completed: 620, remaining: 280 },
    { month: "Sep", completed: 1320, remaining: 580 },
]

const productivityConfig = {
    completed: {
        label: "Completed",
        color: "var(--chart-1)",
    },
    remaining: {
        label: "Remaining",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

// ─── Project Timeline & List Data ───
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]

interface TimelineMember {
    name: string
    task: string
    start: string
    end: string
    color: string
    dateRange: string
}

interface ProjectData {
    id: string
    name: string
    tasksCompleted: number
    tasksTotal: number
    ongoingCount: string
    colorClass: string
    members: TimelineMember[]
}

const projectsData: ProjectData[] = [
    {
        id: "ecommerce",
        name: "E-Commerce",
        tasksCompleted: 840,
        tasksTotal: 2500,
        ongoingCount: "4 ongoing projects",
        colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
        members: [
            { name: "Caleb", task: "UI Design", start: "Jan", end: "May", color: "bg-emerald-600/90 dark:bg-emerald-500/90 text-white border-emerald-400/20", dateRange: "Jan 1 - May 15" },
            { name: "Shaw", task: "UX Design", start: "Mar", end: "Jun", color: "bg-amber-500/90 dark:bg-amber-500/90 text-white border-amber-400/20", dateRange: "Mar 1 - Jun 15" },
            { name: "Jane", task: "Music Integration", start: "Mar", end: "Jul", color: "bg-[#1e3a5f] text-[#a5f3fc] border border-cyan-850/20 dark:border-cyan-800/20", dateRange: "Mar 15 - Jul 10" },
            { name: "Blake", task: "Animation", start: "Feb", end: "Jul", color: "bg-zinc-950 dark:bg-zinc-800 text-white border-zinc-800", dateRange: "Feb 10 - Jul 20" },
            { name: "Quinn", task: "Prototyping", start: "Mar", end: "Aug", color: "bg-orange-600/90 text-white border-orange-500/20", dateRange: "Mar 20 - Aug 5" },
        ]
    },
    {
        id: "mobile",
        name: "Mobile App v2",
        tasksCompleted: 99,
        tasksTotal: 1420,
        ongoingCount: "3 ongoing projects",
        colorClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
        members: [
            { name: "Alex", task: "Frontend Arch", start: "Jan", end: "Apr", color: "bg-orange-600/90 text-white border-orange-500/20", dateRange: "Jan 5 - Apr 12" },
            { name: "Jordan", task: "Dashboard Dev", start: "Feb", end: "Jun", color: "bg-emerald-600/90 dark:bg-emerald-500/90 text-white border-emerald-400/20", dateRange: "Feb 15 - Jun 10" },
            { name: "Taylor", task: "API Routing", start: "Apr", end: "Jul", color: "bg-[#1e3a5f] text-[#a5f3fc] border border-cyan-850/20 dark:border-cyan-800/20", dateRange: "Apr 20 - Jul 15" },
            { name: "Morgan", task: "Layout CSS", start: "Mar", end: "May", color: "bg-amber-500/90 text-white border-amber-400/20", dateRange: "Mar 5 - May 25" },
            { name: "Casey", task: "Tests & Deploy", start: "May", end: "Aug", color: "bg-zinc-950 dark:bg-zinc-800 text-white border-zinc-800", dateRange: "May 10 - Aug 12" },
        ]
    },
    {
        id: "design",
        name: "Design System",
        tasksCompleted: 58,
        tasksTotal: 100,
        ongoingCount: "2 ongoing projects",
        colorClass: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
        members: [
            { name: "Riley", task: "Brand Guidelines", start: "Feb", end: "May", color: "bg-[#1e3a5f] text-[#a5f3fc] border border-cyan-850/20 dark:border-cyan-800/20", dateRange: "Feb 1 - May 5" },
            { name: "Skyler", task: "Asset Creation", start: "Mar", end: "Jun", color: "bg-emerald-600/90 dark:bg-emerald-500/90 text-white border-emerald-400/20", dateRange: "Mar 10 - Jun 18" },
            { name: "Jamie", task: "Theme Engine", start: "May", end: "Aug", color: "bg-amber-500/90 text-white border-amber-400/20", dateRange: "May 15 - Aug 20" },
            { name: "Reese", task: "Copywriting", start: "Apr", end: "Jul", color: "bg-orange-600/90 text-white border-orange-500/20", dateRange: "Apr 5 - Jul 25" },
            { name: "Pat", task: "QA Sandbox", start: "Jun", end: "Aug", color: "bg-zinc-950 dark:bg-zinc-800 text-white border-zinc-800", dateRange: "Jun 1 - Aug 28" },
        ]
    }
]

// ─── Team Performance Data ───
const teamPerformance = [
    {
        id: "001235",
        name: "Aditya Anugrah",
        initials: "AA",
        assigned: 120,
        completed: 110,
        ongoing: 110,
        overdue: 110,
        department: "Development",
        status: "Excellent",
        statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
        id: "001236",
        name: "Fauzan Pradana",
        initials: "FP",
        assigned: 198,
        completed: 85,
        ongoing: 85,
        overdue: 85,
        department: "Marketing",
        status: "Good",
        statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
        id: "001235",
        name: "Galang Andhika",
        initials: "GA",
        assigned: 105,
        completed: 90,
        ongoing: 90,
        overdue: 90,
        department: "Sales",
        status: "Good",
        statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
        id: "001235",
        name: "Septiannisa Eka",
        initials: "SE",
        assigned: 130,
        completed: 125,
        ongoing: 125,
        overdue: 125,
        department: "HR",
        status: "Excellent",
        statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
        id: "001235",
        name: "Judha Maygustya",
        initials: "JM",
        assigned: 115,
        completed: 100,
        ongoing: 100,
        overdue: 100,
        department: "Operations",
        status: "Excellent",
        statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
]

// ─── Task Data ───
const tasks = [
    {
        id: 1,
        title: "AI task decomposition endpoint",
        priority: "High",
        status: "in-progress",
    },
    {
        id: 2,
        title: "Sprint summary streaming",
        priority: "Med",
        status: "todo",
    },
    {
        id: 3,
        title: "Fix payment timeout bug",
        priority: "Urgent",
        status: "todo",
    },
]

// ─── Activity Data ───
const activities = [
    {
        id: 1,
        user: "PR",
        name: "Priya",
        action: "moved FLW-042 to In Review",
        time: "12 min ago",
    },
    {
        id: 2,
        user: "DM",
        name: "Dev",
        action: "created 3 subtasks via AI decompose",
        time: "34 min ago",
    },
    {
        id: 3,
        user: "SK",
        name: "Sara",
        action: "closed FLW-040 — JWT refresh done",
        time: "1 hr ago",
    },
]

type ChartType = "bar" | "line" | "area"

export function DashboardContent() {
    const [chartType, setChartType] = useState<ChartType>("bar")
    const [activeProjectId, setActiveProjectId] = useState<string>("ecommerce")
    const [hoveredTask, setHoveredTask] = useState<{
        task: string
        name: string
        dateRange: string
        x: number
        y: number
    } | null>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const activeProject = React.useMemo(() => {
        return projectsData.find((p) => p.id === activeProjectId) || projectsData[0]
    }, [activeProjectId])

    const getGridSpan = (start: string, end: string) => {
        const startIdx = months.indexOf(start) + 1
        const endIdx = months.indexOf(end) + 2
        return `${startIdx} / ${endIdx}`
    }

    const getProjectIcon = (id: string, className: string) => {
        switch (id) {
            case "ecommerce":
                return <Smartphone className={className} />
            case "mobile":
                return <Laptop className={className} />
            case "design":
                return <Palette className={className} />
            default:
                return <LayoutGrid className={className} />
        }
    }

    const chartButtons: { type: ChartType; icon: React.ReactNode; label: string }[] = [
        { type: "bar", icon: <BarChart3 className="size-3.5" />, label: "Bar" },
        { type: "line", icon: <LineChartIcon className="size-3.5" />, label: "Line" },
        { type: "area", icon: <AreaChartIcon className="size-3.5" />, label: "Area" },
    ]

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* ─── Page Header ─── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track your team&apos;s progress and sprint health.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" />
                        Filter
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="size-4" />
                        New task
                    </Button>
                </div>
            </div>

            {/* ─── Top Stats Row ─── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {topStats.map((stat) => (
                    <Card key={stat.title} className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`size-2.5 rounded-full ${stat.dotColor}`} />
                                    <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="size-7 -mr-1 text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </div>

                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                    }`}>
                                    {stat.trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                    {stat.trend}
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ─── Middle Row: Monthly Productivity Overview (Full Width Chart) ─── */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Monthly Productivity Overview</CardTitle>
                                <CardDescription>Track task progress and completion rates over time.</CardDescription>
                            </div>
                            {/* Chart Type Toggle */}
                            <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
                                {chartButtons.map((btn) => (
                                    <Button
                                        key={btn.type}
                                        variant={chartType === btn.type ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 gap-1.5 text-xs px-2.5"
                                        onClick={() => setChartType(btn.type)}
                                    >
                                        {btn.icon}
                                        {btn.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={productivityConfig} className="h-[340px] w-full">
                            {chartType === "bar" && (
                                <BarChart accessibilityLayer data={productivityData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={8}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Bar
                                        dataKey="completed"
                                        stackId="a"
                                        fill="var(--color-completed)"
                                        radius={[0, 0, 4, 4]}
                                    />
                                    <Bar
                                        dataKey="remaining"
                                        stackId="a"
                                        fill="var(--color-remaining)"
                                        radius={[4, 4, 0, 0]}
                                        fillOpacity={0.6}
                                    />
                                </BarChart>
                            )}

                            {chartType === "line" && (
                                <LineChart
                                    accessibilityLayer
                                    data={productivityData}
                                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                                >
                                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Line
                                        dataKey="completed"
                                        type="monotone"
                                        stroke="var(--color-completed)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        dataKey="remaining"
                                        type="monotone"
                                        stroke="var(--color-remaining)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            )}

                            {chartType === "area" && (
                                <AreaChart
                                    accessibilityLayer
                                    data={productivityData}
                                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                                >
                                    <defs>
                                        <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillRemaining" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-remaining)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--color-remaining)" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Area
                                        dataKey="remaining"
                                        type="natural"
                                        fill="url(#fillRemaining)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-remaining)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="completed"
                                        type="natural"
                                        fill="url(#fillCompleted)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-completed)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            )}
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <div className="flex w-full items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="size-4" />
                                <span className="text-xs">Trending up by 12% this quarter</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-sm bg-[hsl(var(--chart-1))]" />
                                    <span>Completed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-sm bg-[hsl(var(--chart-2))] opacity-60" />
                                    <span>Remaining</span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* ─── New Row: Interactive Project Timeline & Directory ─── */}
            <Card className="w-full">
                <CardContent className="p-6 flex flex-col lg:flex-row gap-0">
                    {/* Left Panel: Project Timeline */}
                    <div className="flex-1 w-full lg:w-[68%] border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800/80 pb-6 lg:pb-0 lg:pr-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold text-foreground tracking-tight">Project Timeline</h2>
                                    {/* Dropdown Menu to switch active project */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 gap-0.5 px-1 text-xs text-muted-foreground hover:text-foreground">
                                                <span className="font-medium text-[11px]">({activeProject.name})</span>
                                                <ChevronRight className="size-3 rotate-90" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="start">
                                            {projectsData.map((proj) => (
                                                <DropdownMenuItem 
                                                    key={proj.id}
                                                    onClick={() => setActiveProjectId(proj.id)}
                                                    className={cn(
                                                        "flex items-center gap-2 cursor-pointer",
                                                        proj.id === activeProjectId && "bg-accent font-medium text-foreground"
                                                    )}
                                                >
                                                    <span className={cn("size-2 rounded-full", 
                                                        proj.id === "ecommerce" ? "bg-emerald-500" :
                                                        proj.id === "mobile" ? "bg-blue-500" : "bg-violet-500"
                                                    )} />
                                                    {proj.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Total {activeProject.tasksCompleted} Task Completed
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </div>

                        {/* Interactive Timeline Grid (Scrollable on Mobile) */}
                        <div className="mt-6 overflow-x-auto scrollbar-none">
                            <div ref={containerRef} className="relative min-w-[620px] pb-2">
                                {/* Month headers */}
                                <div className="flex pb-3 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider relative z-10 border-b dark:border-zinc-800/40">
                                    <div className="w-20 shrink-0 text-left pl-1">Member</div>
                                    <div className="flex-1 grid grid-cols-8 text-center">
                                        {months.map((month) => (
                                            <div key={month}>{month}</div>
                                        ))}
                                    </div>
                                </div>

                            <div className="relative mt-4">
                                {/* Background grid lines overlay */}
                                <div className="absolute inset-0 left-20 pointer-events-none z-0 grid grid-cols-8">
                                    {months.map((_, mIdx) => (
                                        <div 
                                            key={mIdx} 
                                            className="border-l border-dashed border-zinc-200 dark:border-zinc-800/60 h-full first:border-l-0"
                                        />
                                    ))}
                                </div>

                                {/* Timeline rows */}
                                <div className="space-y-4 relative z-10">
                                    {activeProject.members.map((member, idx) => {
                                        const gridColumn = getGridSpan(member.start, member.end)
                                        return (
                                            <div key={idx} className="flex items-center h-8">
                                                {/* Member label */}
                                                <div className="w-20 shrink-0 text-xs font-semibold text-muted-foreground text-left pl-1">
                                                    {member.name}
                                                </div>
                                                {/* Task pill */}
                                                <div className="flex-1 grid grid-cols-8 gap-0 h-full items-center">
                                                    <div 
                                                        className={cn(
                                                            "rounded-full py-1 px-3 text-center text-[10px] font-bold shadow-xs flex items-center justify-center cursor-pointer tracking-wider border border-transparent select-none hover:brightness-105",
                                                            member.color
                                                        )}
                                                        style={{ gridColumn }}
                                                        onMouseEnter={(e) => {
                                                            const rect = containerRef.current?.getBoundingClientRect();
                                                            if (rect) {
                                                                setHoveredTask({
                                                                    task: member.task,
                                                                    name: member.name,
                                                                    dateRange: member.dateRange,
                                                                    x: e.clientX - rect.left,
                                                                    y: e.clientY - rect.top
                                                                });
                                                            }
                                                        }}
                                                        onMouseMove={(e) => {
                                                            const rect = containerRef.current?.getBoundingClientRect();
                                                            if (rect) {
                                                                setHoveredTask({
                                                                    task: member.task,
                                                                    name: member.name,
                                                                    dateRange: member.dateRange,
                                                                    x: e.clientX - rect.left,
                                                                    y: e.clientY - rect.top
                                                                });
                                                            }
                                                        }}
                                                        onMouseLeave={() => {
                                                            setHoveredTask(null);
                                                        }}
                                                    >
                                                        <span className="truncate">{member.task}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Floating Hover Tooltip */}
                            {hoveredTask && (
                                <div 
                                    className="absolute pointer-events-none z-50 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-3 flex flex-col gap-0.5 text-left text-xs min-w-[140px]"
                                    style={{ 
                                        left: hoveredTask.x + 12, 
                                        top: hoveredTask.y + 12,
                                    }}
                                >
                                    <div className="font-bold text-[13px] text-zinc-900 dark:text-zinc-50">{hoveredTask.task}</div>
                                    <div className="text-zinc-500 dark:text-zinc-400 font-medium text-[11px]">{hoveredTask.name}</div>
                                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{hoveredTask.dateRange}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                    {/* Right Panel: Project List */}
                    <div className="w-full lg:w-[32%] pt-6 lg:pt-0 lg:pl-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-foreground tracking-tight">Project List</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {activeProject.ongoingCount}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </div>

                        {/* Interactive Project Directory List */}
                        <div className="flex flex-col gap-2.5">
                            {projectsData.map((project) => {
                                const isActive = project.id === activeProjectId
                                return (
                                    <div
                                        key={project.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setActiveProjectId(project.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                setActiveProjectId(project.id)
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center p-3 px-3.5 rounded-xl text-left w-full transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                            isActive 
                                                ? "bg-zinc-100 dark:bg-zinc-800/80 shadow-xs" 
                                                : "hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                                        )}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {/* Circle indicator matching sidebar */}
                                            <div className="size-9 flex items-center justify-center flex-shrink-0">
                                                <span 
                                                    className={cn(
                                                        "size-3 rounded-full shadow-xs",
                                                        project.id === "ecommerce" && "bg-emerald-500",
                                                        project.id === "mobile" && "bg-blue-500",
                                                        project.id === "design" && "bg-violet-500"
                                                    )}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-semibold text-[13px] text-foreground tracking-tight leading-none">
                                                    {project.name}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground font-medium leading-none mt-1">
                                                    Task {project.tasksCompleted}/{project.tasksTotal >= 1000 ? `${(project.tasksTotal/1000).toFixed(2)}K`.replace(".00K", "K") : project.tasksTotal}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Team Performance Tracker ─── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Team Performance Tracker</CardTitle>
                            <CardDescription>Monitor task assignments and team workload.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                                <Filter className="size-3.5" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                                <RefreshCw className="size-3.5" />
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ongoing</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Overdue</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamPerformance.map((member, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{member.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-7">
                                                    <AvatarFallback className="text-[10px] bg-muted font-medium">
                                                        {member.initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{member.assigned} Task</td>
                                        <td className="px-4 py-3">{member.completed} Task</td>
                                        <td className="px-4 py-3">{member.ongoing} Task</td>
                                        <td className="px-4 py-3">{member.overdue} Task</td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.department}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.statusColor}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}