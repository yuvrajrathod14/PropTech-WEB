import { useEffect, useRef } from "react"
import { useInView, animate, useMotionValue, useTransform, motion } from "framer-motion"

interface StatCounterProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon: React.ReactNode
}

export function StatCounter({ value, suffix = "", prefix = "", label, icon }: StatCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString())
  const nodeRef = useRef(null)
  const isInView = useInView(nodeRef, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      })
      return () => controls.stop()
    }
  }, [isInView, value, count])

  return (
    <div ref={nodeRef} className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 flex items-center">
          {prefix}
          <motion.span>{rounded}</motion.span>
          {suffix}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  )
}
