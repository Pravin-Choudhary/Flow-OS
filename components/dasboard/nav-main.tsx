"use client"

import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useDashboardNav } from "./dashboard-nav-context"

export function NavMain({
    items,
    label,
    className,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
        badge?: string
        navAction?: "dashboard" | "board"
    }[]
    label?: string
    className?: string
}) {
    const { setActiveView, activeView } = useDashboardNav()

    return (
        <SidebarGroup className={className}>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const isActive =
                        item.navAction === "dashboard"
                            ? activeView === "dashboard"
                            : item.isActive

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                isActive={isActive}
                                tooltip={item.title}
                                render={
                                    <button
                                        className="relative flex w-full items-center gap-2"
                                        onClick={() => {
                                            if (item.navAction === "dashboard") {
                                                setActiveView("dashboard")
                                            }
                                        }}
                                    >
                                        <item.icon className="size-4" />
                                        <span>{item.title}</span>
                                        {item.badge && (
                                            <span className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                }
                            />
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}