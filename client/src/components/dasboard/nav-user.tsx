"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { type User } from "./dashboard-nav-context"
import { useRouter } from "next/navigation"

export function NavUser({
    user,
}: {
    user: User
}) {
    const router = useRouter()

    const handleLogout = () => {
        router.push("/")
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="cursor-default select-none pointer-events-none"
                    asChild
                >
                    <div>
                        <Avatar className="h-8 w-8 rounded-full bg-primary text-primary-foreground">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="pointer-events-auto p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Log out"
                        >
                            <LogOut className="size-4" />
                        </button>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}