"use client"

import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useDashboardNav, type ActiveView } from "./dashboard-nav-context"

export function NavMain({
    items,
    label,
    className,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        badge?: string
        viewType: ActiveView
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
                    const isActive = activeView === item.viewType

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                isActive={isActive}
                                tooltip={item.title}
                                render={
                                    <button
                                        className="relative flex w-full items-center gap-2 cursor-pointer"
                                        onClick={() => {
                                            setActiveView(item.viewType)
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