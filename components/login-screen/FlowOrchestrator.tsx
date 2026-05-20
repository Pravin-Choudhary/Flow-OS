"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, GitBranch, Database, Mail, Calendar, BarChart3, Shield, Webhook } from "lucide-react"

interface Node {
    id: string
    x: number
    y: number
    icon: React.ElementType
    label: string
    color: string
    bgColor: string
}

interface Connection {
    from: string
    to: string
}

const nodes: Node[] = [
    { id: "trigger", x: 60, y: 200, icon: Zap, label: "Trigger", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
    { id: "parse", x: 220, y: 120, icon: GitBranch, label: "Parse", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" },
    { id: "enrich", x: 220, y: 280, icon: Database, label: "Enrich", color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.1)" },
    { id: "notify", x: 380, y: 80, icon: Mail, label: "Notify", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" },
    { id: "schedule", x: 380, y: 200, icon: Calendar, label: "Schedule", color: "#ec4899", bgColor: "rgba(236, 72, 153, 0.1)" },
    { id: "analyze", x: 380, y: 320, icon: BarChart3, label: "Analyze", color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.1)" },
    { id: "validate", x: 540, y: 140, icon: Shield, label: "Validate", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)" },
    { id: "output", x: 540, y: 260, icon: Webhook, label: "Output", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
]

const connections: Connection[] = [
    { from: "trigger", to: "parse" },
    { from: "trigger", to: "enrich" },
    { from: "parse", to: "notify" },
    { from: "parse", to: "schedule" },
    { from: "enrich", to: "schedule" },
    { from: "enrich", to: "analyze" },
    { from: "notify", to: "validate" },
    { from: "schedule", to: "validate" },
    { from: "schedule", to: "output" },
    { from: "analyze", to: "output" },
]

function getPathD(from: Node, to: Node): string {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const controlX1 = from.x + dx * 0.5
    const controlY1 = from.y
    const controlX2 = from.x + dx * 0.5
    const controlY2 = to.y
    return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`
}

export function FlowOrchestrator() {
    const [activePackets, setActivePackets] = useState<{ id: string; progress: number; connection: Connection }[]>([])
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const packetIdRef = useRef(0)

    // Spawn data packets periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const randomConn = connections[Math.floor(Math.random() * connections.length)]
            const newPacket = {
                id: `packet-${packetIdRef.current++}`,
                progress: 0,
                connection: randomConn,
            }
            setActivePackets((prev) => [...prev.slice(-15), newPacket])
        }, 800)

        return () => clearInterval(interval)
    }, [])

    // Animate packets
    useEffect(() => {
        let animationId: number
        const animate = () => {
            setActivePackets((prev) =>
                prev
                    .map((p) => ({ ...p, progress: p.progress + 0.015 }))
                    .filter((p) => p.progress < 1)
            )
            animationId = requestAnimationFrame(animate)
        }
        animationId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationId)
    }, [])

    // Get packet position on bezier curve
    function getPacketPosition(connection: Connection, progress: number) {
        const fromNode = nodes.find((n) => n.id === connection.from)!
        const toNode = nodes.find((n) => n.id === connection.to)!
        const t = progress
        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const cx1 = fromNode.x + dx * 0.5
        const cy1 = fromNode.y
        const cx2 = fromNode.x + dx * 0.5
        const cy2 = toNode.y

        const x = Math.pow(1 - t, 3) * fromNode.x + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * Math.pow(t, 2) * cx2 + Math.pow(t, 3) * toNode.x
        const y = Math.pow(1 - t, 3) * fromNode.y + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * Math.pow(t, 2) * cy2 + Math.pow(t, 3) * toNode.y

        return { x, y }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
                <svg
                    viewBox="0 0 600 400"
                    className="w-full h-full"
                    style={{ overflow: "visible" }}
                >
                    <defs>
                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gradient for active paths */}
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    {/* Connection paths */}
                    {connections.map((conn, i) => {
                        const fromNode = nodes.find((n) => n.id === conn.from)!
                        const toNode = nodes.find((n) => n.id === conn.to)!
                        const isHovered = hoveredNode === conn.from || hoveredNode === conn.to

                        return (
                            <g key={`conn-${i}`}>
                                {/* Background path */}
                                <path
                                    d={getPathD(fromNode, toNode)}
                                    fill="none"
                                    stroke="hsl(var(--border))"
                                    strokeWidth="2"
                                    strokeDasharray="6 4"
                                />
                                {/* Active glow path */}
                                <path
                                    d={getPathD(fromNode, toNode)}
                                    fill="none"
                                    stroke={isHovered ? "hsl(var(--primary))" : "url(#pathGradient)"}
                                    strokeWidth={isHovered ? "3" : "2"}
                                    strokeDasharray="6 4"
                                    opacity={isHovered ? 1 : 0.6}
                                    className="transition-all duration-300"
                                />
                            </g>
                        )
                    })}

                    {/* Data packets */}
                    {activePackets.map((packet) => {
                        const pos = getPacketPosition(packet.connection, packet.progress)
                        const fromNode = nodes.find((n) => n.id === packet.connection.from)!
                        return (
                            <g key={packet.id}>
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="5"
                                    fill={fromNode.color}
                                    filter="url(#glow)"
                                    opacity={1 - Math.abs(packet.progress - 0.5) * 0.5}
                                />
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="3"
                                    fill="white"
                                />
                            </g>
                        )
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const Icon = node.icon
                        const isHovered = hoveredNode === node.id

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x}, ${node.y})`}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                            >
                                {/* Node glow ring */}
                                <circle
                                    r="28"
                                    fill={node.bgColor}
                                    className="transition-all duration-300"
                                    style={{
                                        transform: isHovered ? "scale(1.15)" : "scale(1)",
                                        transformOrigin: "center",
                                    }}
                                />

                                {/* Node circle */}
                                <circle
                                    r="24"
                                    fill="hsl(var(--background))"
                                    stroke={isHovered ? node.color : "hsl(var(--border))"}
                                    strokeWidth={isHovered ? "2.5" : "1.5"}
                                    className="transition-all duration-300"
                                    style={{
                                        filter: isHovered ? `drop-shadow(0 0 8px ${node.color}40)` : "none",
                                    }}
                                />

                                {/* Pulse animation for trigger node */}
                                {node.id === "trigger" && (
                                    <>
                                        <circle r="24" fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.5">
                                            <animate
                                                attributeName="r"
                                                values="24;32;24"
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="opacity"
                                                values="0.5;0;0.5"
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </>
                                )}

                                {/* Icon */}
                                <foreignObject x="-10" y="-10" width="20" height="20">
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Icon
                                            className="size-5"
                                            style={{ color: node.color }}
                                            strokeWidth={2}
                                        />
                                    </div>
                                </foreignObject>

                                {/* Label */}
                                <text
                                    y="42"
                                    textAnchor="middle"
                                    className="text-[11px] font-medium fill-muted-foreground"
                                    style={{ fontFamily: "inherit" }}
                                >
                                    {node.label}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Bottom caption */}
            <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-primary">Visual workflow orchestration</p>
                <p className="text-base text-muted-foreground mt-1">Connect tools, automate tasks, track everything</p>
            </div>
        </div>
    )
}