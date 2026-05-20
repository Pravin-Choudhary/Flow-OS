"use client"

import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

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
    }[]
    label?: string
    className?: string
}) {
    return (
        <SidebarGroup className={className}>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                            <a href={item.url} className="relative">
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                                {item.badge && (
                                    <span className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}