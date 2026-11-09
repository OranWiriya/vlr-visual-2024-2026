import type { ReactNode } from 'react'
import { useInView, useReducedMotion } from '../lib/useInView'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const reduced = useReducedMotion()
  const show = inView || reduced

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
