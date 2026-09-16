import { useEffect, useRef } from 'react'

function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    let raf
    let width = window.innerWidth
    let height = window.innerHeight
    const stars = []
    const starCount = Math.min(260, Math.floor((width * height) / 9000))

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const spawnStars = () => {
      stars.length = 0
      for (let i = 0; i < starCount; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.2,
          speed: Math.random() * 0.24 + 0.06,
          glow: Math.random() * 0.8 + 0.2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#050A14'
      ctx.fillRect(0, 0, width, height)

      stars.forEach((star) => {
        star.y += star.speed
        if (star.y > height + 3) {
          star.y = -3
          star.x = Math.random() * width
        }

        const alpha = 0.25 + star.glow * 0.6
        ctx.beginPath()
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = window.requestAnimationFrame(draw)
    }

    resize()
    spawnStars()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('resize', spawnStars)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', spawnStars)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

export default Starfield
