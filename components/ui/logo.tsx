import * as React from "react"

export function FlowOSIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="32" height="32" rx="9" fill="#0b6e51"/>
      
      {/* Dynamic connection lines rendered in the background */}
      <line x1="9" y1="10.5" x2="20" y2="16" stroke="#98f2d4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="9" y1="21.5" x2="20" y2="16" stroke="#98f2d4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="16" x2="27" y2="16" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Left node circles (mint green) */}
      <circle cx="9" cy="10.5" r="3.5" fill="#98f2d4"/>
      <circle cx="9" cy="21.5" r="3.5" fill="#98f2d4"/>
      
      {/* Middle donut node (emerald outer ring with background-colored inner hole) */}
      <circle cx="20" cy="16" r="5.5" fill="#10b981"/>
      <circle cx="20" cy="16" r="2.2" fill="#0b6e51"/>
    </svg>
  )
}

export function FlowOSWordmark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="150"
      height="32"
      viewBox="0 0 150 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="32" height="32" rx="9" fill="#0b6e51"/>
      
      {/* Dynamic connection lines rendered in the background */}
      <line x1="9" y1="10.5" x2="20" y2="16" stroke="#98f2d4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="9" y1="21.5" x2="20" y2="16" stroke="#98f2d4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="16" x2="27" y2="16" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Left node circles (mint green) */}
      <circle cx="9" cy="10.5" r="3.5" fill="#98f2d4"/>
      <circle cx="9" cy="21.5" r="3.5" fill="#98f2d4"/>
      
      {/* Middle donut node (emerald outer ring with background-colored inner hole) */}
      <circle cx="20" cy="16" r="5.5" fill="#10b981"/>
      <circle cx="20" cy="16" r="2.2" fill="#0b6e51"/>
      
      <text
        x="44"
        y="22"
        fontFamily="Inter,system-ui,sans-serif"
        fontSize="19"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        flow
        <tspan fill="#10b981" fontWeight="500">os</tspan>
      </text>
    </svg>
  )
}

