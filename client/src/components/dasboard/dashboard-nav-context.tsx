"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type ActiveView =
    | "dashboard"
    | "board"
    | "backlog"
    | "members"
    | "analytics"
    | "team"
    | "settings"
    | "invitations"

export interface User {
    name: string
    email: string
    avatar: string
    role: "Admin" | "Developer" | "PM" | "Designer"
}

export const AVAILABLE_USERS: User[] = [
    {
        name: "Arjun Sharma",
        email: "arjun@flowos.dev",
        avatar: "",
        role: "Admin",
    },
    {
        name: "Priya Singh",
        email: "priya@flowos.dev",
        avatar: "",
        role: "Developer",
    },
    {
        name: "Meera Joshi",
        email: "meera@flowos.dev",
        avatar: "",
        role: "PM",
    }
]

export interface Invitation {
    id: string
    projectName: string
    roleOffered: string
    adminName: string
    adminEmail: string
    adminAvatar: string
    sentAt: string
    status: "pending" | "accepted" | "declined"
    description: string
}

const initialInvitations: Invitation[] = [
    {
        id: "inv-1",
        projectName: "E-Commerce",
        roleOffered: "Developer",
        adminName: "Arjun Sharma",
        adminEmail: "arjun@flowos.dev",
        adminAvatar: "",
        sentAt: "2 hours ago",
        status: "pending",
        description: "Join the core development team for the checkout redesign project. We need expertise in React, Tailwind, and custom animation hooks.",
    },
    {
        id: "inv-2",
        projectName: "Mobile App v2",
        roleOffered: "UI/UX Designer",
        adminName: "Arjun Sharma",
        adminEmail: "arjun@flowos.dev",
        adminAvatar: "",
        sentAt: "1 day ago",
        status: "pending",
        description: "Help us design the new analytics dashboard and offline sync layouts. High fidelity designs are requested.",
    }
]

interface DashboardNavContextType {
    activeView: ActiveView
    activeProjectId: string
    setActiveView: (view: ActiveView) => void
    setActiveProjectId: (id: string) => void
    navigateToBoard: (projectId: string) => void
    navigateToBacklog: (projectId: string) => void
    navigateToMembers: (projectId: string) => void
    navigateToAnalytics: (projectId: string) => void
    currentUser: User
    setCurrentUser: (user: User) => void
    invitations: Invitation[]
    acceptInvitation: (id: string) => void
    declineInvitation: (id: string) => void

    // Global Popover/Form trigger states
    isNewProjectOpen: boolean
    setIsNewProjectOpen: (open: boolean) => void
    isNewTaskOpen: boolean
    setIsNewTaskOpen: (open: boolean) => void
    isAddMemberOpen: boolean
    setIsAddMemberOpen: (open: boolean) => void
    isSendInvitationOpen: boolean
    setIsSendInvitationOpen: (open: boolean) => void
}

const DashboardNavContext = createContext<DashboardNavContextType>({
    activeView: "dashboard",
    activeProjectId: "ecommerce",
    setActiveView: () => { },
    setActiveProjectId: () => { },
    navigateToBoard: () => { },
    navigateToBacklog: () => { },
    navigateToMembers: () => { },
    navigateToAnalytics: () => { },
    currentUser: AVAILABLE_USERS[0],
    setCurrentUser: () => { },
    invitations: [],
    acceptInvitation: () => { },
    declineInvitation: () => { },

    isNewProjectOpen: false,
    setIsNewProjectOpen: () => { },
    isNewTaskOpen: false,
    setIsNewTaskOpen: () => { },
    isAddMemberOpen: false,
    setIsAddMemberOpen: () => { },
    isSendInvitationOpen: false,
    setIsSendInvitationOpen: () => { },
})

export function DashboardNavProvider({ children }: { children: ReactNode }) {
    const [activeView, setActiveView] = useState<ActiveView>("dashboard")
    const [activeProjectId, setActiveProjectId] = useState<string>("ecommerce")
    const [currentUser, setCurrentUser] = useState<User>(AVAILABLE_USERS[0])
    const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)

    // Global Modal States
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [isSendInvitationOpen, setIsSendInvitationOpen] = useState(false)

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

    const acceptInvitation = (id: string) => {
        setInvitations(prev =>
            prev.map(inv => (inv.id === id ? { ...inv, status: "accepted" as const } : inv))
        )
    }

    const declineInvitation = (id: string) => {
        setInvitations(prev =>
            prev.map(inv => (inv.id === id ? { ...inv, status: "declined" as const } : inv))
        )
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
                currentUser,
                setCurrentUser,
                invitations,
                acceptInvitation,
                declineInvitation,

                isNewProjectOpen,
                setIsNewProjectOpen,
                isNewTaskOpen,
                setIsNewTaskOpen,
                isAddMemberOpen,
                setIsAddMemberOpen,
                isSendInvitationOpen,
                setIsSendInvitationOpen,
            }}
        >
            {children}
        </DashboardNavContext.Provider>
    )
}

export function useDashboardNav() {
    return useContext(DashboardNavContext)
}
