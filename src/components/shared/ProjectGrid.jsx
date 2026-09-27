import { useEffect, useRef } from 'react'
import { cancelFrame, frame } from 'framer-motion'

const CLEARANCE = 8

// Flex columns size the untransformed cards. Apply only the extra separation
// required by their rendered bounds, after Motion has rendered each frame.
function ProjectGrid({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const grid = ref.current
    const columns = [...grid.children].map((column) =>
      [...column.children].map((wrapper) => ({
        wrapper,
        card: wrapper.querySelector('.project-card'),
        x: 0,
        y: 0,
      })),
    )
    const items = columns.flat()
    const transforms = new WeakMap()

    const separate = () => {
      // Subtract our previous correction so it never accumulates. These bounds
      // include perspective, tilt, hover scale/z, and the spring-driven push.
      for (const item of items) {
        const bounds = item.card.getBoundingClientRect()
        transforms.set(item.card, item.card.style.transform)
        transforms.set(item.wrapper, item.wrapper.style.transform)
        item.left = bounds.left - item.x
        item.right = bounds.right - item.x
        item.top = bounds.top - item.y
        item.bottom = bounds.bottom - item.y
        item.x = 0
        item.y = 0
      }

      for (const column of columns) {
        for (let i = 1; i < column.length; i++) {
          const previous = column[i - 1]
          const item = column[i]
          item.y = Math.max(0, previous.bottom + previous.y + CLEARANCE - item.top)
        }
      }

      // Masonry neighbors are determined by vertical overlap, not array rows.
      for (const left of columns[0]) {
        for (const right of columns[1]) {
          if (left.bottom + left.y + CLEARANCE <= right.top + right.y ||
              right.bottom + right.y + CLEARANCE <= left.top + left.y) continue
          const overlap = left.right + left.x + CLEARANCE - right.left - right.x
          if (overlap > 0) {
            left.x -= overlap / 2
            right.x += overlap / 2
          }
        }
      }

      for (const item of items) {
        // Independent of Motion's transform: never overwrite tilt or push.
        item.wrapper.style.translate = `${item.x}px ${item.y}px`
      }
      grid.style.paddingBottom = `${Math.max(0, ...items.map((item) => item.y))}px`
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) frame.postRender(separate, true)
      else cancelFrame(separate)
    })
    // Motion can also flush pointer-driven transforms in a microtask after its
    // frame loop. Resolve those writes before paint, without observing our own
    // translate corrections as new transform changes.
    const mutations = new MutationObserver((records) => {
      if (records.some(({ target }) => transforms.get(target) !== target.style.transform)) separate()
    })
    for (const item of items) {
      mutations.observe(item.card, { attributes: true, attributeFilter: ['style'] })
      mutations.observe(item.wrapper, { attributes: true, attributeFilter: ['style'] })
    }
    observer.observe(grid)
    return () => {
      observer.disconnect()
      mutations.disconnect()
      cancelFrame(separate)
      for (const item of items) item.wrapper.style.removeProperty('translate')
      grid.style.removeProperty('padding-bottom')
    }
  }, [])

  return <div ref={ref} className="projects-grid">{children}</div>
}

export default ProjectGrid
