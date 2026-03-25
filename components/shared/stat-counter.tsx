"use client"

import { useEffect, useState, useRef } from "react"
import { useInView, animate } from "framer-motion"

interface StatCounterProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon: React.ReactNode
}

export function StatCounter({ value, suffix = "", prefix = "", label, icon }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const isInView = useInView(nodeRef, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        onUpdate: (latest) => setCount(Math.floor(latest)),
        ease: "easeOut",
      })
      return () => controls.stop()
    }
  }, [isInView, value])

  return (
    <div ref={nodeRef} className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 flex items-center">
          {prefix}{count.toLocaleString()}{suffix}
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  )
}
