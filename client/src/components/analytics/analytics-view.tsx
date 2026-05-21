"use client"

import React from "react"
import { useDashboardNav } from "@/components/dasboard/dashboard-nav-context"
import { projectsData } from "@/components/dasboard/dashboard-content"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Label } from "recharts"
import { TrendingUp, ArrowLeft, BarChart3, LineChart as LineIcon, Activity, AlertTriangle, RefreshCw } from "lucide-react"

interface AnalyticsViewProps {
    projectId: string
}

// ─── Tailored Analytics Data by Project ───
const projectAnalyticsData: Record<string, {
    problemStatement: string
    solutionFocus: string
    stats: { title: string; value: string; trend: string; trendUp: boolean; subtitle: string; color: string }[]
    lineChartData: { name: string; valA: number; valB: number }[]
    barChartData: { name: string; valA: number; valB: number }[]
    lineChartConfig: ChartConfig
    barChartConfig: ChartConfig
    lineChartConfigLabels: { valALabel: string; valBLabel: string }
    barChartConfigLabels: { valALabel: string; valBLabel: string }
    chartTitles: { lineTitle: string; lineDesc: string; barTitle: string; barDesc: string }
    axisLabels: { lineX: string; lineY: string; barX: string; barY: string }
    tableData: { id: string; name: string; initials: string; metricA: string; metricB: string; role: string; efficiency: string; statusColor: string }[]
}> = {
    ecommerce: {
        problemStatement: "Optimizing purchase conversion rates vs checkout pipeline latency.",
        solutionFocus: "Monitoring real-time checkout pipeline optimization to secure business conversions.",
        stats: [
            { title: "Average Velocity", value: "42 Tasks/Sprint", trend: "+8.4%", trendUp: true, subtitle: "Target is > 40 tasks", color: "bg-emerald-500" },
            { title: "Progress", value: "76.4%", trend: "+5.2%", trendUp: true, subtitle: "Target is 80% by Q2", color: "bg-blue-500" },
            { title: "Active Bugs", value: "3 Bugs", trend: "-40%", trendUp: true, subtitle: "Lowest in 3 months", color: "bg-rose-500" }
        ],
        chartTitles: {
            lineTitle: "Scope Progress vs Development Velocity",
            lineDesc: "Weekly cumulative task completions against total project scope.",
            barTitle: "Task Delivery by Contributor",
            barDesc: "Individual team member completed vs pending tasks."
        },
        axisLabels: {
            lineX: "Sprint Weeks",
            lineY: "Tasks Completed / Total Scope",
            barX: "Team Member",
            barY: "Tasks Count"
        },
        lineChartData: [
            { name: "Week 1", valA: 200, valB: 2500 },
            { name: "Week 2", valA: 350, valB: 2500 },
            { name: "Week 3", valA: 500, valB: 2500 },
            { name: "Week 4", valA: 620, valB: 2500 },
            { name: "Week 5", valA: 740, valB: 2500 },
            { name: "Week 6", valA: 840, valB: 2500 }
        ],
        barChartData: [
            { name: "Caleb", valA: 240, valB: 35 },
            { name: "Shaw", valA: 180, valB: 20 },
            { name: "Jane", valA: 150, valB: 25 },
            { name: "Blake", valA: 160, valB: 15 },
            { name: "Quinn", valA: 110, valB: 10 }
        ],
        lineChartConfig: {
            valA: { label: "Completed Tasks", color: "var(--chart-1)" },
            valB: { label: "Total Project Scope", color: "var(--chart-2)" }
        },
        barChartConfig: {
            valA: { label: "Completed Tasks", color: "var(--chart-1)" },
            valB: { label: "Pending Tasks", color: "var(--chart-3)" }
        },
        lineChartConfigLabels: {
            valALabel: "Completed Tasks",
            valBLabel: "Total Scope"
        },
        barChartConfigLabels: {
            valALabel: "Completed",
            valBLabel: "Pending"
        },
        tableData: [
            { id: "M001", name: "Caleb", initials: "C", metricA: "240 Tasks", metricB: "35 Tasks", role: "Lead UI Engineer", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { id: "M002", name: "Shaw", initials: "S", metricA: "180 Tasks", metricB: "20 Tasks", role: "Senior UX Designer", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { id: "M003", name: "Jane", initials: "J", metricA: "150 Tasks", metricB: "25 Tasks", role: "Audio UX Engineer", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { id: "M004", name: "Blake", initials: "B", metricA: "160 Tasks", metricB: "15 Tasks", role: "Creative Technologist", efficiency: "Outstanding", statusColor: "bg-emerald-150 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-300" },
            { id: "M005", name: "Quinn", initials: "Q", metricA: "110 Tasks", metricB: "10 Tasks", role: "Principal Prototype Builder", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }
        ]
    },
    mobile: {
        problemStatement: "Release velocity optimization and mobile regression control.",
        solutionFocus: "Accelerating local/remote compilation pipelines and boosting unit coverage.",
        stats: [
            { title: "Sprint Target Hits", value: "88.0%", trend: "+2.5%", trendUp: true, subtitle: "Target is > 85%", color: "bg-emerald-500" },
            { title: "Regression Rate", value: "2.1%", trend: "-0.4%", trendUp: true, subtitle: "Target is < 3.0%", color: "bg-blue-500" },
            { title: "Avg Cycle Time", value: "3.2 Days", trend: "-12.5%", trendUp: true, subtitle: "Target is < 4 days", color: "bg-rose-500" }
        ],
        chartTitles: {
            lineTitle: "Release Velocity vs Feature Scope",
            lineDesc: "Accumulative feature progression against total version release backlog.",
            barTitle: "Throughput & Quality by Contributor",
            barDesc: "Individual contributor completed tasks against regression alerts generated."
        },
        axisLabels: {
            lineX: "Development Sprints",
            lineY: "Features Delivered / Total Backlog",
            barX: "Team Member",
            barY: "Tasks & Bugs Count"
        },
        lineChartData: [
            { name: "Sprint 1", valA: 15, valB: 1420 },
            { name: "Sprint 2", valA: 32, valB: 1420 },
            { name: "Sprint 3", valA: 50, valB: 1420 },
            { name: "Sprint 4", valA: 68, valB: 1420 },
            { name: "Sprint 5", valA: 84, valB: 1420 },
            { name: "Sprint 6", valA: 99, valB: 1420 }
        ],
        barChartData: [
            { name: "Alex", valA: 30, valB: 1 },
            { name: "Jordan", valA: 22, valB: 2 },
            { name: "Taylor", valA: 18, valB: 0 },
            { name: "Morgan", valA: 15, valB: 3 },
            { name: "Casey", valA: 14, valB: 0 }
        ],
        lineChartConfig: {
            valA: { label: "Features Delivered", color: "var(--chart-4)" },
            valB: { label: "Total Feature Backlog", color: "var(--chart-2)" }
        },
        barChartConfig: {
            valA: { label: "Tasks Completed", color: "var(--chart-4)" },
            valB: { label: "Regression Bugs", color: "var(--chart-3)" }
        },
        lineChartConfigLabels: {
            valALabel: "Features Delivered",
            valBLabel: "Total Backlog"
        },
        barChartConfigLabels: {
            valALabel: "Tasks Closed",
            valBLabel: "Bugs Generated"
        },
        tableData: [
            { id: "M006", name: "Alex", initials: "A", metricA: "30 Tasks", metricB: "1 Bug", role: "Principal Mobile Architect", efficiency: "Outstanding", statusColor: "bg-emerald-150 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-300" },
            { id: "M007", name: "Jordan", initials: "J", metricA: "22 Tasks", metricB: "2 Bugs", role: "Senior Frontend Engineer", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { id: "M008", name: "Taylor", initials: "T", metricA: "18 Tasks", metricB: "0 Bugs", role: "Lead Systems Integrator", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { id: "M009", name: "Morgan", initials: "M", metricA: "15 Tasks", metricB: "3 Bugs", role: "CSS & Layout Engineer", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { id: "M010", name: "Casey", initials: "C", metricA: "14 Tasks", metricB: "0 Bugs", role: "DevOps Tech Lead", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" }
        ]
    },
    design: {
        problemStatement: "Unifying core design system tokens and reducing redundant CSS styling.",
        solutionFocus: "Increasing atomic design token adoption to eliminate redundant styles.",
        stats: [
            { title: "Token Adoption", value: "92.5%", trend: "+14.2%", trendUp: true, subtitle: "Across 3 core platforms", color: "bg-emerald-500" },
            { title: "Style Compliance", value: "98.7%", trend: "+2.1%", trendUp: true, subtitle: "99% target near reach", color: "bg-blue-500" },
            { title: "Reuse Ratio", value: "4.8x Avg", trend: "+18.5%", trendUp: true, subtitle: "Multi-project component share", color: "bg-rose-500" }
        ],
        chartTitles: {
            lineTitle: "Atomic Token Adoption Velocity",
            lineDesc: "Monthly cumulative component tokenizations against overall published guidelines.",
            barTitle: "Library Contributions & Style Alerts",
            barDesc: "Tokens successfully written against visual validation alerts flagged."
        },
        axisLabels: {
            lineX: "System Iteration Months",
            lineY: "Token Adoption (%) / Guidelines",
            barX: "Team Member",
            barY: "Token & Alert Count"
        },
        lineChartData: [
            { name: "Month 1", valA: 10, valB: 100 },
            { name: "Month 2", valA: 22, valB: 100 },
            { name: "Month 3", valA: 34, valB: 100 },
            { name: "Month 4", valA: 42, valB: 100 },
            { name: "Month 5", valA: 50, valB: 100 },
            { name: "Month 6", valA: 58, valB: 100 }
        ],
        barChartData: [
            { name: "Riley", valA: 15, valB: 0 },
            { name: "Skyler", valA: 18, valB: 1 },
            { name: "Jamie", valA: 12, valB: 2 },
            { name: "Reese", valA: 8, valB: 0 },
            { name: "Pat", valA: 5, valB: 1 }
        ],
        lineChartConfig: {
            valA: { label: "Components Tokenized", color: "var(--chart-5)" },
            valB: { label: "Published Guidelines", color: "var(--chart-2)" }
        },
        barChartConfig: {
            valA: { label: "Tokens Written", color: "var(--chart-5)" },
            valB: { label: "Layout Alerts", color: "var(--chart-3)" }
        },
        lineChartConfigLabels: {
            valALabel: "Tokenized Components",
            valBLabel: "Published Guidelines"
        },
        barChartConfigLabels: {
            valALabel: "Tokens Written",
            valBLabel: "Alerts Flagged"
        },
        tableData: [
            { id: "M011", name: "Riley", initials: "R", metricA: "15 Tokens", metricB: "0 Alerts", role: "Senior Brand Designer", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { id: "M012", name: "Skyler", initials: "S", metricA: "18 Vectors", metricB: "1 Alert", role: "Lead Vector Artist", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { id: "M013", name: "Jamie", initials: "J", metricA: "12 Components", metricB: "2 Alerts", role: "Senior UI Framework Developer", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { id: "M014", name: "Reese", initials: "R", metricA: "8 Docs", metricB: "0 Alerts", role: "UX Copywriter & Strategist", efficiency: "Good", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { id: "M015", name: "Pat", initials: "P", metricA: "5 Sandbox Flows", metricB: "1 Alert", role: "UI Test Suite Specialist", efficiency: "Excellent", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" }
        ]
    }
}

export function AnalyticsView({ projectId }: AnalyticsViewProps) {
    const { setActiveView } = useDashboardNav()

    const activeProject = React.useMemo(() => {
        return projectsData.find((p) => p.id === projectId) || projectsData[0]
    }, [projectId])

    const analytics = React.useMemo(() => {
        return projectAnalyticsData[projectId] || projectAnalyticsData.ecommerce
    }, [projectId])

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
                        <div className="size-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                            <Activity className="size-4.5" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {activeProject.name} Performance Analytics
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 ml-11">
                        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Problem Focus: <span className="font-normal text-muted-foreground">{analytics.problemStatement}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:ml-11">
                    <Button variant="outline" size="sm" className="gap-2 text-xs h-9 rounded-xl">
                        <RefreshCw className="size-3.5" />
                        Refresh Insights
                    </Button>
                </div>
            </div>

            {/* ─── Metrics Stats (Three Cards) ─── */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {analytics.stats.map((stat, sIdx) => (
                    <Card key={sIdx} className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-3.5">
                                <div className={`size-2.5 rounded-full ${stat.color}`} />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
                                <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ─── Two Chart Cards (One Row, Two Columns) ─── */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Line Chart Card */}
                <Card className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl overflow-hidden shadow-xs">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <LineIcon className="size-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Line Chart Integration</span>
                        </div>
                        <CardTitle className="text-base font-semibold text-foreground leading-none">
                            {analytics.chartTitles.lineTitle}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {analytics.chartTitles.lineDesc}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4">
                        <ChartContainer config={analytics.lineChartConfig} className="h-[280px] w-full">
                            <LineChart
                                accessibilityLayer
                                data={analytics.lineChartData}
                                margin={{ top: 20, right: 25, left: 15, bottom: 25 }}
                            >
                                <CartesianGrid vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tick={{ fontSize: 11 }}
                                >
                                    <Label 
                                        value={analytics.axisLabels.lineX} 
                                        position="insideBottom" 
                                        offset={-15} 
                                        className="fill-muted-foreground text-[9px] font-bold tracking-widest uppercase"
                                    />
                                </XAxis>
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tick={{ fontSize: 11 }}
                                >
                                    <Label 
                                        value={analytics.axisLabels.lineY} 
                                        angle={-90} 
                                        position="insideLeft" 
                                        offset={-10} 
                                        className="fill-muted-foreground text-[9px] font-bold tracking-widest uppercase"
                                        style={{ textAnchor: "middle" }}
                                    />
                                </YAxis>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="valA"
                                    type="monotone"
                                    stroke="var(--color-valA)"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                                <Line
                                    dataKey="valB"
                                    type="monotone"
                                    stroke="var(--color-valB)"
                                    strokeWidth={2.5}
                                    strokeDasharray="4 4"
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="border-t border-zinc-200/40 dark:border-zinc-800/30 px-6 py-4 bg-zinc-100/10 dark:bg-zinc-950/10 flex items-center justify-between text-xs text-muted-foreground select-none">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: analytics.lineChartConfig.valA.color }} />
                            <span>{analytics.lineChartConfigLabels.valALabel}</span>
                            <div className="size-2 rounded-full ml-2" style={{ backgroundColor: analytics.lineChartConfig.valB.color }} />
                            <span>{analytics.lineChartConfigLabels.valBLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="size-3.5" />
                            <span>Optimal Bounds</span>
                        </div>
                    </CardFooter>
                </Card>

                {/* Bar Chart Card */}
                <Card className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl overflow-hidden shadow-xs">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <BarChart3 className="size-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Bar Chart Integration</span>
                        </div>
                        <CardTitle className="text-base font-semibold text-foreground leading-none">
                            {analytics.chartTitles.barTitle}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {analytics.chartTitles.barDesc}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4">
                        <ChartContainer config={analytics.barChartConfig} className="h-[280px] w-full">
                            <BarChart 
                                accessibilityLayer 
                                data={analytics.barChartData}
                                margin={{ top: 20, right: 25, left: 15, bottom: 25 }}
                            >
                                <CartesianGrid vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tick={{ fontSize: 11 }}
                                >
                                    <Label 
                                        value={analytics.axisLabels.barX} 
                                        position="insideBottom" 
                                        offset={-15} 
                                        className="fill-muted-foreground text-[9px] font-bold tracking-widest uppercase"
                                    />
                                </XAxis>
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tick={{ fontSize: 11 }}
                                >
                                    <Label 
                                        value={analytics.axisLabels.barY} 
                                        angle={-90} 
                                        position="insideLeft" 
                                        offset={-10} 
                                        className="fill-muted-foreground text-[9px] font-bold tracking-widest uppercase"
                                        style={{ textAnchor: "middle" }}
                                    />
                                </YAxis>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dashed" />}
                                />
                                <Bar dataKey="valA" fill="var(--color-valA)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="valB" fill="var(--color-valB)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="border-t border-zinc-200/40 dark:border-zinc-800/30 px-6 py-4 bg-zinc-100/10 dark:bg-zinc-950/10 flex items-center justify-between text-xs text-muted-foreground select-none">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: analytics.barChartConfig.valA.color }} />
                            <span>{analytics.barChartConfigLabels.valALabel}</span>
                            <div className="size-2 rounded-full ml-2" style={{ backgroundColor: analytics.barChartConfig.valB.color }} />
                            <span>{analytics.barChartConfigLabels.valBLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="size-3.5" />
                            <span>Active Improvement</span>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* ─── Team Contribution Tracker (Table) ─── */}
            <Card className="bg-zinc-50/20 dark:bg-zinc-900/5 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl overflow-hidden shadow-xs">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-foreground">Analytics Contributor Workload</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Detailed view of project contributions and delivery efficiency.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-200/60 dark:border-zinc-800/40 select-none">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Core Deliverables</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Validation State</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Designation</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Efficiency Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.tableData.map((member, i) => (
                                    <tr key={i} className="border-b border-zinc-200/40 dark:border-zinc-800/30 last:border-0 hover:bg-accent/50 transition-colors">
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
                                        <td className="px-4 py-3">{member.metricA}</td>
                                        <td className="px-4 py-3">{member.metricB}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.role}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.statusColor}`}>
                                                {member.efficiency}
                                            </span>
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
