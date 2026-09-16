import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'

function TiltCard({ children, className = '', style = {}, onMouseEnter, onMouseLeave, forceStatic = false }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useTransform(mx, [-0.5, 0.5], [10, -10])
  const rotateX = useTransform(my, [-0.5, 0.5], [-10, 10])
  const isMobile = forceStatic || (typeof window !== 'undefined' && window.innerWidth <= 768)

  const onMove = (event) => {
    if (isMobile) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    mx.set(x)
    my.set(y)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  if (isMobile) {
    return (
      <article
        ref={ref}
        className={className}
        style={{ ...style, marginTop: 0 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </article>
    )
  }

  return (
    <motion.article
      ref={ref}
      className={className}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={(e) => {
        onLeave()
        onMouseLeave?.(e)
      }}
      whileHover={{ scale: 1.02, z: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.article>
  )
}

export default TiltCard
