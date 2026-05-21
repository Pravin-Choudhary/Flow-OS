"use client"

import { useState } from "react"
import { FlowOrchestrator } from "./FlowOrchestrator"
import { LoginForm } from "./LoginForm"
import { SignUpForm } from "./SignUpForm"

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "signup">("login")

    return (
        <div className="flex min-h-screen">
            {/* Left: Form Section */}
            <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16 xl:px-24">
                {mode === "login" ? (
                    <LoginForm onSwitchMode={() => setMode("signup")} />
                ) : (
                    <SignUpForm onSwitchMode={() => setMode("login")} />
                )}
            </div>

            {/* Right: Flow Orchestrator */}
            <div className="hidden lg:flex lg:w-1/2 bg-muted/10 items-center justify-center px-12 py-12">
                <FlowOrchestrator />
            </div>
        </div>
    )
}