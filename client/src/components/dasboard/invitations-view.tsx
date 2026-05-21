"use client"

import React from "react"
import { useDashboardNav } from "./dashboard-nav-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Check, X, ArrowLeft, Calendar, ShieldCheck } from "lucide-react"

export function InvitationsView() {
    const { setActiveView, invitations, acceptInvitation, declineInvitation } = useDashboardNav()

    const pendingCount = invitations.filter((inv) => inv.status === "pending").length

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-[1000px] mx-auto w-full">
            {/* ─── Page Header ─── */}
            <div className="flex flex-col gap-1.5 border-b border-zinc-200/60 dark:border-zinc-800/40 pb-6">
                <button
                    onClick={() => setActiveView("dashboard")}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 w-fit outline-none cursor-pointer"
                >
                    <ArrowLeft className="size-3.5" />
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                        <Mail className="size-4.5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Workspace Invitations
                    </h1>
                    {pendingCount > 0 && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-full select-none">
                            {pendingCount} Pending
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground ml-11">
                    Accept invitations from workspace administrators to join project boards, sprint planning, and collaborate with team members.
                </p>
            </div>

            {/* ─── Invitations Grid ─── */}
            {invitations.length > 0 ? (
                <div className="flex flex-col gap-6 mt-2">
                    {invitations.map((inv) => {
                        const isPending = inv.status === "pending"
                        const isAccepted = inv.status === "accepted"
                        const isDeclined = inv.status === "declined"

                        return (
                            <Card
                                key={inv.id}
                                className={`relative overflow-hidden transition-all duration-300 border-zinc-200/60 dark:border-zinc-800/40 rounded-3xl shadow-xs hover:shadow-md ${
                                    isAccepted
                                        ? "bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-200/50 dark:border-emerald-900/20"
                                        : isDeclined
                                        ? "opacity-60 bg-zinc-50/10 dark:bg-zinc-950/5"
                                        : "bg-zinc-50/20 dark:bg-zinc-900/5 hover:border-zinc-350 dark:hover:border-zinc-700/60"
                                }`}
                            >
                                {/* Left accent indicator */}
                                <div
                                    className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                                        isAccepted
                                            ? "bg-emerald-500"
                                            : isDeclined
                                            ? "bg-zinc-400"
                                            : "bg-primary"
                                    }`}
                                />

                                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 pl-8">
                                    <div className="flex-1 flex flex-col gap-4">
                                        {/* Row 1: Project details & Role Offered */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                                {inv.projectName} Project
                                            </h2>
                                            <Badge
                                                variant="secondary"
                                                className="bg-primary/5 text-primary border border-primary/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none"
                                            >
                                                Role: {inv.roleOffered}
                                            </Badge>
                                        </div>

                                        {/* Row 2: Description */}
                                        <p className="text-sm text-zinc-650 dark:text-zinc-455 leading-relaxed">
                                            {inv.description}
                                        </p>

                                        {/* Row 3: Admin metadata */}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <Avatar className="size-6 bg-zinc-200 dark:bg-zinc-800">
                                                <AvatarFallback className="text-[9px] font-bold">
                                                    {inv.adminName.split(" ").map((n) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                Invited by <strong className="font-semibold text-foreground">{inv.adminName}</strong> ({inv.adminEmail})
                                            </span>
                                            <span className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3" />
                                                {inv.sentAt}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex sm:flex-row md:flex-col items-center justify-end gap-3 shrink-0 self-center md:self-start w-full sm:w-auto md:w-44">
                                        {isPending ? (
                                            <>
                                                <Button
                                                    onClick={() => acceptInvitation(inv.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 h-9 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <Check className="size-3.5" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => declineInvitation(inv.id)}
                                                    className="w-full border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 font-semibold text-xs py-2 h-9 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <X className="size-3.5" />
                                                    Decline
                                                </Button>
                                            </>
                                        ) : isAccepted ? (
                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-950/30 border border-emerald-250/20 px-4 py-2 rounded-xl text-xs font-bold w-full justify-center">
                                                <ShieldCheck className="size-4" />
                                                Joined Project
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-950/20 border border-zinc-200/10 px-4 py-2 rounded-xl text-xs font-medium w-full justify-center">
                                                <X className="size-4" />
                                                Declined
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl mt-4">
                    <p className="text-sm text-muted-foreground">You don&apos;t have any invitations right now.</p>
                </div>
            )}
        </div>
    )
}
