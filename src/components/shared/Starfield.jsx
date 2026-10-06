import { useEffect, useRef } from 'react'

function Starfield() {
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    let raf
    let width = window.innerWidth
    let height = window.innerHeight
    let wrapHeight = height

    // Retain particle identities across renders and Strict Mode effect replay.
    if (particlesRef.current === null) {
      const starCount = Math.min(260, Math.floor((width * height) / 9000))
      particlesRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.2,
        speed: Math.random() * 0.24 + 0.06,
        glow: Math.random() * 0.8 + 0.2,
      }))
    }
    const stars = particlesRef.current

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#050A14'
      ctx.fillRect(0, 0, width, height)

      stars.forEach((star) => {
        const alpha = 0.25 + star.glow * 0.6
        ctx.beginPath()
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const resize = () => {
      const nextWidth = window.innerWidth
      const nextHeight = window.innerHeight
      if (nextWidth !== width) {
        // Real layout/orientation changes reproject the existing particles.
        stars.forEach((star) => {
          star.x *= nextWidth / width
          star.y *= nextHeight / wrapHeight
        })
        wrapHeight = nextHeight
      } else {
        // Toolbar changes must not wrap particles merely because the visible
        // viewport shrank. Keep their simulation bounds until a width change.
        wrapHeight = Math.max(wrapHeight, nextHeight)
      }
      width = nextWidth
      height = nextHeight
      if (canvas.width === width && canvas.height === height) return
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      // Resizing clears the bitmap. Repaint synchronously without advancing
      // particles or starting another animation loop.
      render()
    }

    const draw = () => {
      stars.forEach((star) => {
        star.y += star.speed
        if (star.y > wrapHeight + 3) {
          star.y = -3
          star.x = Math.random() * width
        }
      })
      render()
      raf = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

export default Starfield
