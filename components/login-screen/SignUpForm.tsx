"use client"

import { useState } from "react"
import { ArrowRight, Zap } from "lucide-react"
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

interface SignUpFormProps {
    onSwitchMode: () => void
}

export function SignUpForm({ onSwitchMode }: SignUpFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Zap className="size-5" />
                </div>
                <span className="text-xl font-semibold tracking-tight">
                    Flow<span className="text-primary">OS</span>
                </span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Start managing your team in minutes
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2.5">
                    <Label htmlFor="signup-name" className="text-sm font-medium">
                        Full Name
                    </Label>
                    <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="Arjun Sharma"
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2.5">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                        Work Email
                    </Label>
                    <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2.5">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                        Password
                    </Label>
                    <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        className="h-11"
                    />
                </div>

                <div className="space-y-2.5">
                    <Label htmlFor="signup-role" className="text-sm font-medium">
                        Your Role
                    </Label>
                    <Select name="role" defaultValue="admin">
                        <SelectTrigger id="signup-role" className="h-11">
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="qa">QA Engineer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 gap-2 text-sm font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="animate-spin">
                            <svg className="size-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </span>
                    ) : (
                        <>
                            Create account <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="font-medium text-primary hover:underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                >
                    Sign in
                </button>
            </p>
        </div>
    )
}