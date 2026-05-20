"use client"

import { useState } from "react"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface LoginFormProps {
    onSwitchMode: () => void
}

export function LoginForm({ onSwitchMode }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
        router.push("/dashboard")
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
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Sign in to your account to continue
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2.5">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                        Work Email
                    </Label>
                    <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm font-medium">
                            Password
                        </Label>
                        <a href="#" className="text-xs text-primary hover:underline underline-offset-4">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        className="h-11"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal">
                        Remember me for 30 days
                    </Label>
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
                            Sign in <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="font-medium text-primary hover:underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                >
                    Create account
                </button>
            </p>
        </div>
    )
}