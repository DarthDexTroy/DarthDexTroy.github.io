import { useEffect, useRef } from 'react'
import { HERO_CODE_SNIPPETS } from '../../constants/data'

function HeroCodeRings() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    let raf = null
    let lastFrame = 0
    let lastTick = 0
    let mobileLockedHeight = 0
    let lastResizeWidth = 0

    const rings = [
      {
        radius: 0,
        speed: 0.0016,
        offset: 0,
        desktopColor: 'rgba(0, 229, 255, 0.18)',
        mobileColor: 'rgba(0, 229, 255, 0.24)',
      },
      {
        radius: 0,
        speed: -0.0012,
        offset: Math.PI * 0.26,
        desktopColor: 'rgba(0, 229, 255, 0.21)',
        mobileColor: 'rgba(0, 229, 255, 0.27)',
      },
      {
        radius: 0,
        speed: 0.001,
        offset: Math.PI * 0.53,
        desktopColor: 'rgba(0, 229, 255, 0.24)',
        mobileColor: 'rgba(0, 229, 255, 0.30)',
      },
      {
        radius: 0,
        speed: -0.0008,
        offset: Math.PI * 0.79,
        desktopColor: 'rgba(0, 229, 255, 0.26)',
        mobileColor: 'rgba(0, 229, 255, 0.33)',
      },
      {
        radius: 0,
        speed: 0.0006,
        offset: Math.PI * 1.07,
        desktopColor: 'rgba(0, 229, 255, 0.28)',
        mobileColor: 'rgba(0, 229, 255, 0.36)',
      },
    ]

    const initRadii = () => {
      const base = window.innerWidth * 0.48
      rings[0].radius = base * 0.25
      rings[1].radius = base * 0.42
      rings[2].radius = base * 0.58
      rings[3].radius = base * 0.74
      rings[4].radius = base * 0.9
    }

    initRadii()

    const stopLoop = () => {
      if (raf !== null) {
        window.cancelAnimationFrame(raf)
        raf = null
      }
    }

    const draw = (deltaSeconds) => {
      const isMobileViewport = window.innerWidth <= 768
      const motionMultiplier = isMobileViewport ? 1 : 0.4
      const estimatedCharWidth = isMobileViewport ? 8 : 7.3
      const snippetPixelWidth = 20 * estimatedCharWidth
      const mobileAreaRatio =
        (canvas.width * canvas.height) / (390 * 844)
      const mobileDensity = Math.min(1.35, Math.max(0.9, mobileAreaRatio))
      const minGap = isMobileViewport ? Math.max(98, Math.round(152 / mobileDensity)) : 70
      const maxVisibleSnippets = isMobileViewport
        ? Math.min(4, Math.max(2, Math.round(1 + mobileDensity * 2)))
        : 12
      const mobileRingCount = Math.min(rings.length, Math.max(3, Math.round(1 + mobileDensity * 1.5)))
      const activeRings = isMobileViewport ? rings.slice(0, mobileRingCount) : rings

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      const occupiedPoints = []
      const minSeparation = isMobileViewport ? Math.max(92, Math.round(112 / mobileDensity)) : 0
      const edgePadding = isMobileViewport ? 48 : 0
      const safeCenterX = isMobileViewport ? canvas.width * 0.46 : 0
      const safeCenterY = isMobileViewport ? canvas.height * 0.34 : 0
      ctx.font = `${isMobileViewport ? 10.8 : 11}px 'IBM Plex Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      activeRings.forEach((ring, ringIndex) => {
        ring.offset += ring.speed * deltaSeconds * 60 * motionMultiplier
        const ringPhaseOffset = isMobileViewport ? (ringIndex * Math.PI) / activeRings.length : 0

        const desktopRadiusX = ring.radius
        const desktopRadiusY = ring.radius

        const radiusX = isMobileViewport ? (ring.radiusX ?? ring.radius) : desktopRadiusX
        const radiusY = isMobileViewport ? (ring.radiusY ?? ring.radius) : desktopRadiusY
        const orbitRadius = ring.radius

        const circumference = 2 * Math.PI * orbitRadius
        const maxSnippets = Math.floor(circumference / (snippetPixelWidth + minGap))
        const snippetCount = Math.max(1, Math.min(maxSnippets, maxVisibleSnippets))

        for (let i = 0; i < snippetCount; i += 1) {
          const angle = ring.offset + ringPhaseOffset + (i / snippetCount) * Math.PI * 2
          const x = cx + radiusX * Math.cos(angle)
          const desktopFloat = isMobileViewport
            ? 0
            : Math.sin(ring.offset * 6 + i * 0.9 + ringIndex * 0.6) * (2 + ringIndex * 0.7)
          const y = cy + radiusY * Math.sin(angle) + desktopFloat

          if (isMobileViewport) {
            const inHeroSafeZone = Math.abs(x - cx) < safeCenterX && Math.abs(y - cy) < safeCenterY
            if (inHeroSafeZone) continue

            const nearEdge =
              x < edgePadding ||
              x > canvas.width - edgePadding ||
              y < edgePadding ||
              y > canvas.height - edgePadding
            if (nearEdge) continue

            const tooClose = occupiedPoints.some((point) => {
              const dx = x - point.x
              const dy = y - point.y
              return dx * dx + dy * dy < minSeparation * minSeparation
            })
            if (tooClose) continue

            occupiedPoints.push({ x, y })
          }

          // Guaranteed unique snippet index per slot in viewport
          const snippetGlobalIndex = (ringIndex * 9 + i) % HERO_CODE_SNIPPETS.length
          const snippet = HERO_CODE_SNIPPETS[snippetGlobalIndex]

          // Depth tier: 0 = Far, 1 = Mid, 2 = Near
          const tier = (ringIndex * 7 + i * 3) % 3

          let fontSize = 12
          let opacityBase = 0.32

          if (tier === 0) {
            // Far tier: smaller font-size (10-11px), lower opacity (~0.15-0.20)
            fontSize = isMobileViewport ? 9.6 : 10.5
            opacityBase = 0.18
          } else if (tier === 1) {
            // Mid tier: baseline font-size (~12px), baseline opacity (~0.30-0.35)
            fontSize = isMobileViewport ? 11.2 : 12.0
            opacityBase = 0.32
          } else {
            // Near tier: larger font-size (~13-14px), higher opacity (~0.45-0.50)
            fontSize = isMobileViewport ? 12.5 : 13.8
            opacityBase = 0.48
          }

          ctx.save()
          ctx.translate(x, y)
          ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const desktopPulse = 0.8 + ((Math.sin(ring.offset * 5 + i * 0.7 + ringIndex) + 1) / 2) * 0.2
          const alpha = (opacityBase * (isMobileViewport ? 1 : desktopPulse)).toFixed(3)
          const color = `rgba(0, 229, 255, ${alpha})`

          ctx.fillStyle = color
          ctx.shadowColor = 'rgba(0, 229, 255, 0.38)'
          ctx.shadowBlur = tier === 2 ? 3.5 : tier === 1 ? 2.4 : 1.2
          ctx.fillText(snippet, 0, 0)
          ctx.shadowBlur = 0
          ctx.restore()
        }
      })
    }

    const animate = (timestamp) => {
      const frameInterval = 33
      if (timestamp - lastFrame < frameInterval) {
        raf = window.requestAnimationFrame(animate)
        return
      }

      const deltaSeconds = lastTick === 0 ? 1 / 60 : (timestamp - lastTick) / 1000
      lastTick = timestamp
      lastFrame = timestamp
      draw(deltaSeconds)
      raf = window.requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (raf !== null) return
      raf = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      const width = window.innerWidth
      const isMobileViewport = width <= 768
      let height = window.innerHeight

      if (isMobileViewport) {
        if (mobileLockedHeight === 0) {
          mobileLockedHeight = Math.max(window.innerHeight, window.screen.height || 0)
          lastResizeWidth = width
        }

        const widthChanged = Math.abs(width - lastResizeWidth) > 24
        if (widthChanged) {
          mobileLockedHeight = Math.max(window.innerHeight, window.screen.height || 0)
          lastResizeWidth = width
        }

        height = mobileLockedHeight
      } else {
        mobileLockedHeight = 0
        lastResizeWidth = width
      }

      const canvasHeight = isMobileViewport ? mobileLockedHeight : window.innerHeight

      if (canvas.width === width && canvas.height === canvasHeight) {
        return
      }

      canvas.width = width
      canvas.height = canvasHeight
      canvas.style.width = `${width}px`
      canvas.style.height = `${canvasHeight}px`

      const base = canvas.width * 0.48
      rings[0].radius = base * 0.25
      rings[1].radius = base * 0.42
      rings[2].radius = base * 0.58
      rings[3].radius = base * 0.74
      rings[4].radius = base * 0.9

      if (isMobileViewport) {
        const mobileBaseX = canvas.width * 0.52
        const mobileBaseY = canvas.height * 0.5

        rings[0].radiusX = mobileBaseX * 0.22
        rings[1].radiusX = mobileBaseX * 0.38
        rings[2].radiusX = mobileBaseX * 0.54
        rings[3].radiusX = mobileBaseX * 0.7
        rings[4].radiusX = mobileBaseX * 0.86

        rings[0].radiusY = mobileBaseY * 0.24
        rings[1].radiusY = mobileBaseY * 0.4
        rings[2].radiusY = mobileBaseY * 0.56
        rings[3].radiusY = mobileBaseY * 0.72
        rings[4].radiusY = mobileBaseY * 0.88
      }
      draw(1 / 60)
    }

    resize()
    startLoop()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      stopLoop()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-code-rings" aria-hidden="true" />
}

export default HeroCodeRings
