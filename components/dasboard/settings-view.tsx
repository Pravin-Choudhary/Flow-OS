"use client"

import React, { useState } from "react"
import { useDashboardNav } from "./dashboard-nav-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Settings,
    User,
    Briefcase,
    Users,
    Lock,
    ArrowLeft,
    Trash2,
    Plus,
    Camera,
    CheckCircle2,
    Shield,
    Eye,
    EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "profile" | "workspace" | "members" | "security"

const TABS = [
    { id: "profile" as TabType, label: "Profile", icon: User, description: "Personal details & avatar" },
    { id: "workspace" as TabType, label: "Workspace", icon: Briefcase, description: "Platform configuration" },
    { id: "members" as TabType, label: "Members", icon: Users, description: "Roster & access roles" },
    { id: "security" as TabType, label: "Security", icon: Lock, description: "Credentials & policies" },
]

function FieldRow({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={htmlFor} className="text-xs font-semibold text-muted-foreground tracking-wide">
                {label}
            </Label>
            {children}
        </div>
    )
}

function SaveToast({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="size-4 shrink-0" />
            {message}
        </div>
    )
}

export function SettingsView() {
    const { setActiveView, currentUser } = useDashboardNav()
    const [activeTab, setActiveTab] = useState<TabType>("profile")
    const [toast, setToast] = useState<string | null>(null)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)

    const triggerToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 3000)
    }

    const [membersList, setMembersList] = useState([
        { name: "Arjun Sharma", email: "arjun@flowos.dev", role: "Admin", joined: "Jan 12, 2025" },
        { name: "Priya Singh", email: "priya@flowos.dev", role: "Developer", joined: "Feb 18, 2025" },
        { name: "Rahul Kumar", email: "rahul@flowos.dev", role: "Developer", joined: "Mar 05, 2025" },
        { name: "Meera Joshi", email: "meera@flowos.dev", role: "PM", joined: "Apr 22, 2025" },
    ])

    const handleRemoveMember = (email: string) => {
        setMembersList((prev) => prev.filter((m) => m.email !== email))
        triggerToast("Member removed from workspace.")
    }

    const MOCK_POOL = [
        { name: "Aarav Patel", email: "aarav@flowos.dev", role: "Developer" },
        { name: "Ananya Rao", email: "ananya@flowos.dev", role: "Designer" },
        { name: "Vihaan Shah", email: "vihaan@flowos.dev", role: "QA" },
        { name: "Kavya Iyer", email: "kavya@flowos.dev", role: "PM" },
    ]

    const handleInviteMember = () => {
        const available = MOCK_POOL.filter((p) => !membersList.some((m) => m.email === p.email))
        if (!available.length) return
        const pick = available[Math.floor(Math.random() * available.length)]
        setMembersList((prev) => [
            ...prev,
            { ...pick, joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) },
        ])
        triggerToast(`Invitation sent to ${pick.name}.`)
    }

    const ROLE_BADGE: Record<string, string> = {
        Admin: "bg-primary/10 text-primary border-primary/20",
        Developer: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        PM: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        Designer: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        QA: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    }

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1100px] mx-auto w-full">
            {/* ─── Page Header ─── */}
            <div className="flex flex-col gap-3 border-b border-border/50 pb-8">
                <button
                    onClick={() => setActiveView("dashboard")}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-fit transition-colors outline-none cursor-pointer"
                >
                    <ArrowLeft className="size-3.5" />
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-3.5">
                    <div className="size-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary shrink-0">
                        <Settings className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-none">
                            Workspace Settings
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1.5">
                            Manage your profile, workspace configuration, team roster, and security credentials.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && <SaveToast message={toast} />}

            {/* ─── Grid Layout ─── */}
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">

                {/* ─── Sidebar Nav ─── */}
                <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all cursor-pointer whitespace-nowrap md:w-full group",
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                        >
                            <tab.icon className={cn(
                                "size-4 shrink-0 transition-colors",
                                activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <div className="flex flex-col gap-0.5 text-left hidden md:flex">
                                <span className="text-xs font-bold leading-none">{tab.label}</span>
                                <span className={cn(
                                    "text-[10px] leading-none font-medium",
                                    activeTab === tab.id ? "text-primary/70" : "text-muted-foreground/70"
                                )}>
                                    {tab.description}
                                </span>
                            </div>
                            <span className="text-xs font-bold md:hidden">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* ─── Panel Area ─── */}
                <div>

                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <Card className="border-border/50 rounded-3xl bg-background shadow-xs">
                            <CardHeader className="p-6 pb-4 border-b border-border/40">
                                <CardTitle className="text-base font-extrabold">Profile Details</CardTitle>
                                <CardDescription className="text-xs">
                                    Update your display name, email address, role bio, and workspace avatar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col gap-6">
                                {/* Avatar row */}
                                <div className="flex items-center gap-5 pb-5 border-b border-border/30">
                                    <div className="relative group size-16 rounded-full cursor-pointer shrink-0">
                                        <Avatar className="size-16 ring-2 ring-primary/20">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-extrabold">
                                                {currentUser.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="size-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-sm font-bold text-foreground">{currentUser.name}</span>
                                        <span className="text-xs text-muted-foreground">{currentUser.email}</span>
                                        <div className="flex gap-2 mt-1">
                                            <Button variant="outline" size="xs" className="rounded-xl cursor-pointer">Upload Photo</Button>
                                            <Button variant="ghost" size="xs" className="rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer">Remove</Button>
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={(e) => { e.preventDefault(); triggerToast("Profile saved successfully!") }}
                                    className="flex flex-col gap-5"
                                >
                                    <FieldRow>
                                        <Field label="First Name" htmlFor="firstName">
                                            <Input id="firstName" defaultValue={currentUser.name.split(" ")[0]} className="rounded-xl h-9 text-sm" required />
                                        </Field>
                                        <Field label="Last Name" htmlFor="lastName">
                                            <Input id="lastName" defaultValue={currentUser.name.split(" ").slice(1).join(" ")} className="rounded-xl h-9 text-sm" required />
                                        </Field>
                                    </FieldRow>

                                    <Field label="Email Address" htmlFor="email">
                                        <Input id="email" type="email" defaultValue={currentUser.email} className="rounded-xl h-9 text-sm" required />
                                    </Field>

                                    <Field label="Workspace Role">
                                        <Input value={currentUser.role} disabled className="rounded-xl h-9 text-sm opacity-60 cursor-not-allowed" />
                                    </Field>

                                    <Field label="Professional Bio" htmlFor="bio">
                                        <textarea
                                            id="bio"
                                            rows={3}
                                            defaultValue={
                                                currentUser.role === "Admin"
                                                    ? "Principal Product Architect & Workspace Owner. Guides platform efforts and sprint cycles."
                                                    : "Core frontend/full-stack engineer. Building responsive and high-performance modules."
                                            }
                                            className="w-full rounded-xl border border-transparent bg-input/50 px-3 py-2.5 text-sm resize-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 placeholder:text-muted-foreground transition-all"
                                        />
                                    </Field>

                                    <div className="flex justify-end pt-1">
                                        <Button type="submit" size="sm" className="rounded-xl px-5 cursor-pointer">
                                            Save Profile
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* WORKSPACE */}
                    {activeTab === "workspace" && (
                        <div className="flex flex-col gap-5">
                            <Card className="border-border/50 rounded-3xl bg-background shadow-xs">
                                <CardHeader className="p-6 pb-4 border-b border-border/40">
                                    <CardTitle className="text-base font-extrabold">Workspace Configuration</CardTitle>
                                    <CardDescription className="text-xs">
                                        Configure platform defaults, sprint structures, and global task sizing conventions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); triggerToast("Workspace configuration updated!") }}
                                        className="flex flex-col gap-5"
                                    >
                                        <Field label="Workspace Name" htmlFor="wsName">
                                            <Input id="wsName" defaultValue="FlowOS Devspace" className="rounded-xl h-9 text-sm" required />
                                        </Field>

                                        <Field label="Workspace URL" htmlFor="wsUrl">
                                            <div className="flex items-center">
                                                <span className="h-9 flex items-center px-3 text-xs text-muted-foreground bg-muted/60 border border-transparent rounded-l-xl border-r-0 select-none font-mono whitespace-nowrap">
                                                    flowos.dev/
                                                </span>
                                                <Input
                                                    id="wsUrl"
                                                    defaultValue="workspace/main"
                                                    className="rounded-l-none rounded-r-xl h-9 text-sm border-l-0"
                                                    required
                                                />
                                            </div>
                                        </Field>

                                        <FieldRow>
                                            <Field label="Default Sprint Length">
                                                <Select defaultValue="2">
                                                    <SelectTrigger className="rounded-xl w-full h-9 text-sm">
                                                        <SelectValue placeholder="Select length" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 Week</SelectItem>
                                                        <SelectItem value="2">2 Weeks</SelectItem>
                                                        <SelectItem value="3">3 Weeks</SelectItem>
                                                        <SelectItem value="4">4 Weeks</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            <Field label="Story Point Scale">
                                                <Select defaultValue="fib">
                                                    <SelectTrigger className="rounded-xl w-full h-9 text-sm">
                                                        <SelectValue placeholder="Select scale" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fib">Fibonacci (1, 2, 3, 5, 8, 13)</SelectItem>
                                                        <SelectItem value="lin">Linear (1–5)</SelectItem>
                                                        <SelectItem value="tshirt">T-Shirt (S, M, L, XL)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </FieldRow>

                                        <div className="flex justify-end pt-1">
                                            <Button type="submit" size="sm" className="rounded-xl px-5 cursor-pointer">
                                                Save Configuration
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-destructive/20 rounded-3xl bg-destructive/5 shadow-xs">
                                <CardHeader className="p-6 pb-3">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <Shield className="size-4" />
                                        <CardTitle className="text-sm font-extrabold text-destructive">Danger Zone</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">
                                        Permanent actions that cannot be reversed. Proceed with absolute caution.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-destructive/15">
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Delete this Workspace</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                Permanently removes all projects, sprint boards, task history, and member data.
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="rounded-xl shrink-0 cursor-pointer"
                                        >
                                            <Trash2 className="size-3.5" />
                                            Delete Workspace
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* MEMBERS */}
                    {activeTab === "members" && (
                        <Card className="border-border/50 rounded-3xl bg-background shadow-xs">
                            <CardHeader className="p-6 pb-4 border-b border-border/40">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-base font-extrabold">Members & Roles</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            Manage active workspace accounts and role-based access permissions.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={handleInviteMember}
                                        className="rounded-xl shrink-0 cursor-pointer"
                                    >
                                        <Plus className="size-3.5" />
                                        Invite
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="hover:bg-transparent border-border/40">
                                                <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground pl-6">Member</TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground hidden sm:table-cell">Email</TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Role</TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground hidden md:table-cell">Joined</TableHead>
                                                <TableHead className="w-10" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {membersList.map((m) => (
                                                <TableRow key={m.email} className="border-border/30 hover:bg-muted/20">
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar className="size-7 shrink-0">
                                                                <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-extrabold">
                                                                    {m.name.split(" ").map((n) => n[0]).join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs font-semibold text-foreground truncate">{m.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground font-mono hidden sm:table-cell">{m.email}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full border", ROLE_BADGE[m.role] ?? ROLE_BADGE.QA)}
                                                        >
                                                            {m.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{m.joined}</TableCell>
                                                    <TableCell className="pr-4">
                                                        {m.role !== "Admin" ? (
                                                            <button
                                                                onClick={() => handleRemoveMember(m.email)}
                                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground/60 font-semibold select-none italic px-1">Owner</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* SECURITY */}
                    {activeTab === "security" && (
                        <div className="flex flex-col gap-5">
                            <Card className="border-border/50 rounded-3xl bg-background shadow-xs">
                                <CardHeader className="p-6 pb-4 border-b border-border/40">
                                    <CardTitle className="text-base font-extrabold">Update Password</CardTitle>
                                    <CardDescription className="text-xs">
                                        Rotate your workspace sign-in credentials. Use a strong, unique password.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); triggerToast("Password updated successfully!") }}
                                        className="flex flex-col gap-5"
                                    >
                                        <Field label="Current Password" htmlFor="currPass">
                                            <div className="relative">
                                                <Input
                                                    id="currPass"
                                                    type={showCurrent ? "text" : "password"}
                                                    placeholder="Enter current password"
                                                    className="rounded-xl h-9 text-sm pr-10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrent((v) => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    {showCurrent ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                                </button>
                                            </div>
                                        </Field>

                                        <FieldRow>
                                            <Field label="New Password" htmlFor="newPass">
                                                <div className="relative">
                                                    <Input
                                                        id="newPass"
                                                        type={showNew ? "text" : "password"}
                                                        placeholder="Minimum 8 characters"
                                                        className="rounded-xl h-9 text-sm pr-10"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNew((v) => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                    >
                                                        {showNew ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                                    </button>
                                                </div>
                                            </Field>
                                            <Field label="Confirm New Password" htmlFor="confPass">
                                                <Input
                                                    id="confPass"
                                                    type="password"
                                                    placeholder="Repeat new password"
                                                    className="rounded-xl h-9 text-sm"
                                                    required
                                                />
                                            </Field>
                                        </FieldRow>

                                        <div className="flex justify-end pt-1">
                                            <Button type="submit" size="sm" className="rounded-xl px-5 cursor-pointer">
                                                Update Password
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Session info card */}
                            <Card className="border-border/50 rounded-3xl bg-background shadow-xs">
                                <CardHeader className="p-6 pb-4 border-b border-border/40">
                                    <CardTitle className="text-base font-extrabold">Active Sessions</CardTitle>
                                    <CardDescription className="text-xs">
                                        Review and revoke devices with active workspace access.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-col gap-4">
                                    {[
                                        { device: "Chrome on macOS", location: "Mumbai, IN", time: "Active now", current: true },
                                        { device: "Safari on iPhone", location: "New Delhi, IN", time: "2 hours ago", current: false },
                                    ].map((s) => (
                                        <div key={s.device} className="flex items-center justify-between gap-4 py-3 border-b border-border/30 last:border-0">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-foreground">{s.device}</span>
                                                    {s.current && (
                                                        <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{s.location} · {s.time}</span>
                                            </div>
                                            {!s.current && (
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    className="rounded-xl text-destructive border-destructive/20 hover:bg-destructive/10 cursor-pointer"
                                                    onClick={() => triggerToast("Session revoked.")}
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
