"use client"

import { Kanban, BarChart3, Users } from "lucide-react"

const features = [
    {
        icon: Kanban,
        title: "Kanban boards",
        description: "Visual task tracking across sprints",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-emerald-100 dark:border-emerald-900/40",
    },
    {
        icon: BarChart3,
        title: "Sprint analytics",
        description: "Velocity, burndown and workload charts",
        bgColor: "bg-sky-50 dark:bg-sky-950/30",
        iconColor: "text-sky-600 dark:text-sky-400",
        borderColor: "border-sky-100 dark:border-sky-900/40",
    },
    {
        icon: Users,
        title: "Team management",
        description: "Role-based access, workload tracking",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        borderColor: "border-amber-100 dark:border-amber-900/40",
    },
]

export function FeatureShowcase() {
    return (
        <div className="flex flex-col justify-center h-full w-full max-w-[420px]">
            {/* Hero Text Block */}
            <div className="mb-10">
                <h1 className="text-[28px] font-bold tracking-tight leading-[1.2] text-foreground mb-4">
                    The ops brain for<br />
                    engineering teams
                </h1>
                <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[340px]">
                    Projects, sprints, tasks, and team workload — all in one place. No noise, just flow.
                </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-10">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className={`flex items-start gap-4 rounded-xl border ${feature.borderColor} ${feature.bgColor} p-4 transition-all duration-200 hover:shadow-sm`}
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-background shadow-sm">
                            <feature.icon className={`size-[18px] ${feature.iconColor}`} />
                        </div>
                        <div className="pt-0.5">
                            <h3 className="text-[13px] font-semibold text-foreground leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sprint Health Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-5">
                    {/* Circular Progress */}
                    <div className="relative flex size-[72px] shrink-0 items-center justify-center">
                        <svg className="size-[72px] -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="2.5"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2.5"
                                strokeDasharray={`${84}, 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-[15px] font-bold tabular-nums">84</span>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-1">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            Sprint 4 health
                        </p>
                        <p className="text-[15px] font-semibold text-foreground">On track</p>
                        <p className="text-[13px] text-muted-foreground">12 of 18 tasks done</p>
                    </div>
                </div>
            </div>
        </div>
    )
}