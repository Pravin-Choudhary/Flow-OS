"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { format } from "date-fns"
import { useDashboardNav } from "./dashboard-nav-context"
import { cn } from "@/lib/utils"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
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
import { Calendar } from "@/components/ui/calendar"
import {
    FolderPlus,
    CheckSquare,
    UserPlus,
    Mail,
    Calendar as CalIcon,
    Check,
    Globe,
    Lock,
    Clock,
    AlertCircle,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const LEADS = [
    { name: "Arjun Sharma", email: "arjun@flowos.dev" },
    { name: "Priya Singh", email: "priya@flowos.dev" },
    { name: "Meera Joshi", email: "meera@flowos.dev" },
]

const COLORS = [
    { label: "Red",    cls: "bg-red-500" },
    { label: "Amber",  cls: "bg-amber-500" },
    { label: "Green",  cls: "bg-emerald-500" },
    { label: "Blue",   cls: "bg-blue-500" },
    { label: "Purple", cls: "bg-purple-500" },
    { label: "Gray",   cls: "bg-zinc-500" },
]

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function F({
    label,
    children,
    half,
}: {
    label: string
    children: React.ReactNode
    half?: boolean
}) {
    return (
        <div className={cn("flex flex-col gap-1.5", half && "flex-1 min-w-0")}>
            <Label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                {label}
            </Label>
            {children}
        </div>
    )
}

const inputCls =
    "h-9 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 px-3"

const textareaCls =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-600 px-3 py-2.5 resize-none outline-none focus:border-zinc-600 transition-colors"

const dialogCls =
    "sm:max-w-[440px] bg-zinc-950 border border-zinc-800 rounded-2xl p-0 gap-0 shadow-2xl"

const selectTriggerCls =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm h-9 hover:border-zinc-600 focus-visible:ring-0 focus-visible:border-zinc-600 data-placeholder:text-zinc-600"

// ─── Portal-based DatePicker ──────────────────────────────────────────────────
// Renders the calendar at document.body via createPortal with fixed positioning
// so it always floats above overflow-hidden/overflow-y-auto containers.

function DatePicker({
    date,
    onSelect,
    placeholder,
}: {
    date: Date | undefined
    onSelect: (d: Date | undefined) => void
    placeholder: string
}) {
    const [open, setOpen] = React.useState(false)
    const [rect, setRect] = React.useState<{ top: number; left: number; width: number } | null>(null)
    const btnRef = React.useRef<HTMLButtonElement>(null)
    const mounted = React.useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    )

    // Recalculate position on scroll / resize while open
    React.useEffect(() => {
        if (!open) return
        const update = () => {
            if (btnRef.current) {
                const r = btnRef.current.getBoundingClientRect()
                setRect({ top: r.bottom + 6, left: r.left, width: r.width })
            }
        }
        update()
        window.addEventListener("scroll", update, true)
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("scroll", update, true)
            window.removeEventListener("resize", update)
        }
    }, [open])

    const handleToggle = () => {
        if (!open && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect()
            setRect({ top: r.bottom + 6, left: r.left, width: r.width })
        }
        setOpen((v) => !v)
    }

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={handleToggle}
                className="flex w-full h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 hover:border-zinc-600 transition-colors outline-none"
            >
                <CalIcon className="size-3.5 text-zinc-500 shrink-0" />
                {date
                    ? <span className="text-zinc-200">{format(date, "MMM d, yyyy")}</span>
                    : <span className="text-zinc-600">{placeholder}</span>
                }
            </button>

            {mounted && open && rect && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0"
                        style={{ zIndex: 9998 }}
                        onClick={() => setOpen(false)}
                    />
                    {/* Calendar popup — fixed above everything */}
                    <div
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            zIndex: 9999,
                        }}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                onSelect(d)
                                setOpen(false)
                            }}
                        />
                    </div>
                </>,
                document.body
            )}
        </>
    )
}

// ─── 1. NEW PROJECT (Admin only) ───────────────────────────────────────────────

function NewProjectDialog() {
    const { isNewProjectOpen, setIsNewProjectOpen, currentUser } = useDashboardNav()

    const [name, setName] = React.useState("")
    const [key, setKey] = React.useState("")
    const [desc, setDesc] = React.useState("")
    const [lead, setLead] = React.useState(LEADS[0].name)
    const [color, setColor] = React.useState("Blue")
    const [start, setStart] = React.useState<Date | undefined>()
    const [end, setEnd] = React.useState<Date | undefined>()
    const [scope, setScope] = React.useState<"public" | "private">("public")

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        setName(v)
        setKey(v.split(" ").map((w) => w[0] ?? "").join("").slice(0, 4).toUpperCase())
    }

    const reset = () => {
        setName(""); setKey(""); setDesc("")
        setStart(undefined); setEnd(undefined)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Project "${name}" (${key}) created!`)
        setIsNewProjectOpen(false)
        reset()
    }

    // All hooks called unconditionally above — safe to guard render here
    if (currentUser.role !== "Admin") return null

    return (
        <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogContent className={dialogCls}>

                {/* Header */}
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                            <FolderPlus className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-zinc-100 leading-none">
                                Create New Project
                            </DialogTitle>
                            <DialogDescription className="text-[11px] text-zinc-500 mt-0.5">
                                Provision a workspace project board for your sprint team.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable body — scrollbar hidden */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                >
                    <div
                        className="px-5 py-5 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        style={{ maxHeight: "calc(80vh - 130px)" }}
                    >
                        {/* Name + Key */}
                        <div className="flex gap-3">
                            <F label="Project Name" half>
                                <Input
                                    required
                                    placeholder="e.g. Mobile App v3"
                                    value={name}
                                    onChange={handleName}
                                    className={inputCls}
                                />
                            </F>
                            <F label="Key">
                                <Input
                                    required
                                    maxLength={4}
                                    placeholder="KEY"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                                    className={cn(inputCls, "w-16 text-center font-bold tracking-widest")}
                                />
                            </F>
                        </div>

                        {/* Description */}
                        <F label="Description">
                            <textarea
                                placeholder="Outline the objective, scope and key deliverables..."
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                rows={2}
                                className={textareaCls}
                            />
                        </F>

                        {/* Project Lead */}
                        <F label="Project Lead">
                            <Select value={lead} onValueChange={(v) => v !== null && setLead(v)}>
                                <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select lead" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                    {LEADS.map((l) => (
                                        <SelectItem key={l.name} value={l.name} className="text-zinc-200 focus:bg-zinc-800">
                                            {l.name}
                                            <span className="text-zinc-500 text-xs ml-1">· {l.email}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </F>

                        {/* Color */}
                        <F label="Theme Color">
                            <div className="flex gap-2 pt-0.5">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.label}
                                        type="button"
                                        title={c.label}
                                        onClick={() => setColor(c.label)}
                                        className={cn(
                                            "size-6 rounded-full transition-all relative shrink-0",
                                            c.cls,
                                            color === c.label
                                                ? "ring-2 ring-offset-1 ring-offset-zinc-950 ring-white scale-110"
                                                : "opacity-60 hover:opacity-90"
                                        )}
                                    >
                                        {color === c.label && (
                                            <Check className="size-3 absolute inset-0 m-auto text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </F>

                        {/* Dates */}
                        <div className="flex gap-3">
                            <F label="Start Date" half>
                                <DatePicker date={start} onSelect={setStart} placeholder="Pick date" />
                            </F>
                            <F label="Target End" half>
                                <DatePicker date={end} onSelect={setEnd} placeholder="Pick date" />
                            </F>
                        </div>

                        {/* Access Scope */}
                        <F label="Access Scope">
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                                {(["public", "private"] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setScope(s)}
                                        className={cn(
                                            "flex flex-col gap-1 p-3 rounded-lg border text-left transition-all cursor-pointer",
                                            scope === s
                                                ? "border-zinc-600 bg-zinc-800"
                                                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                                        )}
                                    >
                                        <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                                            {s === "public"
                                                ? <Globe className="size-3.5 text-primary shrink-0" />
                                                : <Lock className="size-3.5 text-amber-400 shrink-0" />}
                                            {s === "public" ? "Public" : "Private"}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 leading-snug">
                                            {s === "public" ? "Open to all members." : "Restricted — invite only."}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </F>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => { setIsNewProjectOpen(false); reset() }}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="rounded-lg px-5 cursor-pointer">
                            Create Project
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── 2. NEW TASK ───────────────────────────────────────────────────────────────

function NewTaskDialog() {
    const { isNewTaskOpen, setIsNewTaskOpen } = useDashboardNav()

    const [title, setTitle] = React.useState("")
    const [desc, setDesc] = React.useState("")
    const [status, setStatus] = React.useState("Backlog")
    const [priority, setPriority] = React.useState("medium")
    const [assignee, setAssignee] = React.useState(LEADS[0].name)
    const [points, setPoints] = React.useState("3")
    const [label, setLabel] = React.useState("Feature")
    const [due, setDue] = React.useState<Date | undefined>()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Task "${title}" added to "${status}".`)
        setIsNewTaskOpen(false)
        setTitle(""); setDesc(""); setDue(undefined)
    }

    return (
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogContent className={dialogCls}>
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                            <CheckSquare className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-zinc-100 leading-none">Create New Task</DialogTitle>
                            <DialogDescription className="text-[11px] text-zinc-500 mt-0.5">
                                Add a task card to your board or backlog sprint.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div
                        className="px-5 py-5 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        style={{ maxHeight: "calc(80vh - 130px)" }}
                    >
                        <F label="Task Title">
                            <Input
                                required
                                placeholder="e.g. Implement WebAuthn authentication"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={inputCls}
                            />
                        </F>

                        <F label="Details / Definition of Done">
                            <textarea
                                placeholder="Goals, acceptance criteria, technical notes..."
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                rows={3}
                                className={textareaCls}
                            />
                        </F>

                        <div className="flex gap-3">
                            <F label="Assignee" half>
                                <Select value={assignee} onValueChange={(v) => v !== null && setAssignee(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Assignee" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {LEADS.map((l) => (
                                            <SelectItem key={l.name} value={l.name} className="text-zinc-200 focus:bg-zinc-800">{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                            <F label="Status" half>
                                <Select value={status} onValueChange={(v) => v !== null && setStatus(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["Backlog", "To Do", "In Progress", "Review", "Done"].map((s) => (
                                            <SelectItem key={s} value={s} className="text-zinc-200 focus:bg-zinc-800">{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                        </div>

                        <div className="flex gap-3">
                            <F label="Priority" half>
                                <Select value={priority} onValueChange={(v) => v !== null && setPriority(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["low", "medium", "high", "urgent"].map((p) => (
                                            <SelectItem key={p} value={p} className="text-zinc-200 focus:bg-zinc-800 capitalize">{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                            <F label="Points" half>
                                <Select value={points} onValueChange={(v) => v !== null && setPoints(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="pts" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["1", "2", "3", "5", "8", "13"].map((p) => (
                                            <SelectItem key={p} value={p} className="text-zinc-200 focus:bg-zinc-800">{p} {p === "1" ? "pt" : "pts"}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                            <F label="Label" half>
                                <Select value={label} onValueChange={(v) => v !== null && setLabel(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Label" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["Feature", "Bugfix", "Refactor", "Docs", "UX"].map((l) => (
                                            <SelectItem key={l} value={l} className="text-zinc-200 focus:bg-zinc-800">{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                        </div>

                        <F label="Due Date">
                            <DatePicker date={due} onSelect={setDue} placeholder="Select due date" />
                        </F>
                    </div>

                    <div className="px-5 py-4 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewTaskOpen(false)}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="rounded-lg px-5 cursor-pointer">
                            Add Task
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── 3. ADD MEMBER ─────────────────────────────────────────────────────────────

function AddMemberDialog() {
    const { isAddMemberOpen, setIsAddMemberOpen } = useDashboardNav()

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [title, setTitle] = React.useState("")
    const [role, setRole] = React.useState("Developer")
    const [scope, setScope] = React.useState("member")
    const [note, setNote] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Member "${name}" (${email}) provisioned as ${role}.`)
        setIsAddMemberOpen(false)
        setName(""); setEmail(""); setTitle(""); setNote("")
    }

    return (
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogContent className={dialogCls}>
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                            <UserPlus className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-zinc-100 leading-none">Add Team Member</DialogTitle>
                            <DialogDescription className="text-[11px] text-zinc-500 mt-0.5">
                                Provision a new user account into this workspace.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div
                        className="px-5 py-5 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        style={{ maxHeight: "calc(80vh - 130px)" }}
                    >
                        <F label="Full Name">
                            <Input required placeholder="e.g. Kabir Malhotra" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                        </F>

                        <F label="Corporate Email">
                            <Input required type="email" placeholder="e.g. kabir@flowos.dev" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                        </F>

                        <F label="Designation / Title">
                            <Input required placeholder="e.g. Senior Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
                        </F>

                        <div className="flex gap-3">
                            <F label="Role" half>
                                <Select value={role} onValueChange={(v) => v !== null && setRole(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["Developer", "PM", "Designer", "QA"].map((r) => (
                                            <SelectItem key={r} value={r} className="text-zinc-200 focus:bg-zinc-800">{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                            <F label="Permission" half>
                                <Select value={scope} onValueChange={(v) => v !== null && setScope(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Scope" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        <SelectItem value="member" className="text-zinc-200 focus:bg-zinc-800">Standard Member</SelectItem>
                                        <SelectItem value="admin" className="text-zinc-200 focus:bg-zinc-800">Workspace Admin</SelectItem>
                                        <SelectItem value="billing" className="text-zinc-200 focus:bg-zinc-800">Billing Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </F>
                        </div>

                        <F label="Welcome Note (optional)">
                            <textarea
                                placeholder="Write a welcome message for the registration email..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={2}
                                className={textareaCls}
                            />
                        </F>

                        <div className="flex items-start gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                            <AlertCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                The user will receive a magic-link registration email to complete workspace setup.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-4 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddMemberOpen(false)}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="rounded-lg px-5 cursor-pointer">
                            Provision Member
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── 4. SEND INVITATION ────────────────────────────────────────────────────────

function SendInvitationDialog() {
    const { isSendInvitationOpen, setIsSendInvitationOpen } = useDashboardNav()

    const [email, setEmail] = React.useState("")
    const [project, setProject] = React.useState("ecommerce")
    const [role, setRole] = React.useState("Developer")
    const [expiry, setExpiry] = React.useState("7d")
    const [note, setNote] = React.useState("")

    const expiryMap: Record<string, string> = { "24h": "24 hours", "7d": "7 days", "30d": "30 days" }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Invitation sent to ${email}. Expires in ${expiryMap[expiry]}.`)
        setIsSendInvitationOpen(false)
        setEmail(""); setNote("")
    }

    return (
        <Dialog open={isSendInvitationOpen} onOpenChange={setIsSendInvitationOpen}>
            <DialogContent className={dialogCls}>
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                            <Mail className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-zinc-100 leading-none">Send Invitation</DialogTitle>
                            <DialogDescription className="text-[11px] text-zinc-500 mt-0.5">
                                Invite external collaborators to join a project.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div
                        className="px-5 py-5 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        style={{ maxHeight: "calc(80vh - 130px)" }}
                    >
                        <F label="Recipient Email">
                            <Input required type="email" placeholder="e.g. freelancer@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                        </F>

                        <F label="Project">
                            <Select value={project} onValueChange={(v) => v !== null && setProject(v)}>
                                <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                    <SelectItem value="ecommerce" className="text-zinc-200 focus:bg-zinc-800">E-Commerce Platform</SelectItem>
                                    <SelectItem value="mobile" className="text-zinc-200 focus:bg-zinc-800">Mobile App v2</SelectItem>
                                    <SelectItem value="brand" className="text-zinc-200 focus:bg-zinc-800">Brand Redesign</SelectItem>
                                </SelectContent>
                            </Select>
                        </F>

                        <div className="flex gap-3">
                            <F label="Role" half>
                                <Select value={role} onValueChange={(v) => v !== null && setRole(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        {["Developer", "PM", "Designer", "QA"].map((r) => (
                                            <SelectItem key={r} value={r} className="text-zinc-200 focus:bg-zinc-800">{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </F>
                            <F label="Link Expires" half>
                                <Select value={expiry} onValueChange={(v) => v !== null && setExpiry(v)}>
                                    <SelectTrigger className={selectTriggerCls}>
                                        <SelectValue placeholder="Expiry" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                                        <SelectItem value="24h" className="text-zinc-200 focus:bg-zinc-800">24 Hours</SelectItem>
                                        <SelectItem value="7d" className="text-zinc-200 focus:bg-zinc-800">7 Days</SelectItem>
                                        <SelectItem value="30d" className="text-zinc-200 focus:bg-zinc-800">30 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </F>
                        </div>

                        <F label="Message (optional)">
                            <textarea
                                placeholder="Write a custom greeting for the collaborator..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={2}
                                className={textareaCls}
                            />
                        </F>

                        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                            <Clock className="size-3.5 text-amber-400 shrink-0" />
                            <p className="text-[10px] text-zinc-500">
                                Invitation link expires in <span className="text-zinc-300 font-medium">{expiryMap[expiry]}</span>.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-4 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsSendInvitationOpen(false)}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="rounded-lg px-5 cursor-pointer">
                            Send Invite
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function GlobalForms() {
    return (
        <>
            <NewProjectDialog />
            <NewTaskDialog />
            <AddMemberDialog />
            <SendInvitationDialog />
        </>
    )
}
