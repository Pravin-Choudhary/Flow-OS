"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type ActiveView = "dashboard" | "board" | "backlog" | "members" | "analytics"

interface DashboardNavContextType {
    activeView: ActiveView
    activeProjectId: string
    setActiveView: (view: ActiveView) => void
    setActiveProjectId: (id: string) => void
    navigateToBoard: (projectId: string) => void
    navigateToBacklog: (projectId: string) => void
    navigateToMembers: (projectId: string) => void
    navigateToAnalytics: (projectId: string) => void
}

const DashboardNavContext = createContext<DashboardNavContextType>({
    activeView: "dashboard",
    activeProjectId: "ecommerce",
    setActiveView: () => {},
    setActiveProjectId: () => {},
    navigateToBoard: () => {},
    navigateToBacklog: () => {},
    navigateToMembers: () => {},
    navigateToAnalytics: () => {},
})

export function DashboardNavProvider({ children }: { children: ReactNode }) {
    const [activeView, setActiveView] = useState<ActiveView>("dashboard")
    const [activeProjectId, setActiveProjectId] = useState<string>("ecommerce")

    const navigateToBoard = (projectId: string) => {
        setActiveProjectId(projectId)
        setActiveView("board")
    }

    const navigateToBacklog = (projectId: string) => {
        setActiveProjectId(projectId)
        setActiveView("backlog")
    }

    const navigateToMembers = (projectId: string) => {
        setActiveProjectId(projectId)
        setActiveView("members")
    }

    const navigateToAnalytics = (projectId: string) => {
        setActiveProjectId(projectId)
        setActiveView("analytics")
    }

    return (
        <DashboardNavContext.Provider
            value={{
                activeView,
                activeProjectId,
                setActiveView,
                setActiveProjectId,
                navigateToBoard,
                navigateToBacklog,
                navigateToMembers,
                navigateToAnalytics,
            }}
        >
            {children}
        </DashboardNavContext.Provider>
    )
}

export function useDashboardNav() {
    return useContext(DashboardNavContext)
}
