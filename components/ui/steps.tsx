import type React from "react"
import { cn } from "@/lib/utils"

interface StepProps {
  title: string
  description: string
}

export const Step: React.FC<StepProps> = ({ title, description }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
        {title.split(" ")[1]}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface StepsProps {
  children: React.ReactNode
  className?: string
}

export const Steps: React.FC<StepsProps> = ({ children, className }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

