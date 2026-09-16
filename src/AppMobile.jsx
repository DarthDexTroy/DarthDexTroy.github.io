import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import './App.css'
import HeroWireframe from './components/desktop/HeroWireframe'
import ExperienceCard from './components/shared/ExperienceCard'
import HeroCodeRings from './components/shared/HeroCodeRings'
import ProjectCard from './components/shared/ProjectCard'
import ShakeToUnlock from './components/shared/ShakeToUnlock'
import Starfield from './components/shared/Starfield'
import Typewriter from './components/shared/Typewriter'
import {
  CONTACT_LINKS,
  CONTACT_TERMINAL_TEXT,
  HERO_ROTATING_TEXT,
  NAV_ITEMS,
  NAV_SOCIAL_LINKS,
  PROJECTS,
  RESUME_PDF_URL,
} from './constants/data'
import { CHILD_VARIANTS, SECTION_VARIANTS } from './constants/variants'

function AppMobile() {
  const [showSplash, setShowSplash] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [contactText, setContactText] = useState('')
  const [contactTypingStarted, setContactTypingStarted] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    mass: 0.25,
  })

  const openResumeDocument = () => {
    const fallbackLink = document.createElement('a')
    fallbackLink.href = RESUME_PDF_URL
    fallbackLink.target = '_blank'
    fallbackLink.rel = 'noopener noreferrer'
    fallbackLink.style.display = 'none'
    document.body.appendChild(fallbackLink)
    fallbackLink.click()
    fallbackLink.remove()
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll('.reveal-child'))
    if (revealTargets.length === 0) return undefined

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    revealTargets.forEach((target) => revealObserver.observe(target))

    return () => revealObserver.disconnect()
  }, [])

  useEffect(() => {
    const sectionIds = ['hero', 'skills', 'projects', 'experience', 'contact']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (sections.length === 0) return undefined

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.4 },
    )

    sections.forEach((section) => navObserver.observe(section))

    return () => navObserver.disconnect()
  }, [])

  useEffect(() => {
    const contactSection = document.getElementById('contact')
    if (!contactSection) return undefined

    const contactObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setContactTypingStarted(true)
          observer.disconnect()
        })
      },
      { threshold: 0.15 },
    )

    contactObserver.observe(contactSection)

    return () => contactObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!contactTypingStarted) return undefined

    setContactText('')
    let index = 0
    let timeoutId = null

    const typeNext = () => {
      setContactText(CONTACT_TERMINAL_TEXT.slice(0, index + 1))
      index += 1
      if (index < CONTACT_TERMINAL_TEXT.length) {
        timeoutId = window.setTimeout(typeNext, 35)
      }
    }

    timeoutId = window.setTimeout(typeNext, 35)

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [contactTypingStarted])

  return (
    <>
      <HeroCodeRings />
      <Starfield />
      <div className="grid-overlay" aria-hidden="true" />

      <motion.div className="scroll-progress" style={{ scaleX: progressScaleX }} />

      {showSplash && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="splash-mark"
            initial={{ scale: 0.2, letterSpacing: '0.05em' }}
            animate={{ scale: 1.4, letterSpacing: '0.4em' }}
            transition={{ duration: 1.2, ease: [0.2, 1, 0.2, 1] }}
          >
            VV
          </motion.div>
        </motion.div>
      )}

      <header className="nav-shell glass-panel">
        <div className="nav-brand">VEDHA VADDEPALLY</div>
        <button
          type="button"
          className="menu-toggle interactive"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-link-group">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link interactive ${activeSection === item.href.slice(1) ? 'nav-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <span className="nav-divider" aria-hidden="true" />

          <div className="nav-socials">
            {NAV_SOCIAL_LINKS.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  className="nav-social interactive"
                  href={item.href}
                  target={item.label !== 'Email' ? '_blank' : undefined}
                  rel={item.label !== 'Email' ? 'noreferrer' : undefined}
                  aria-label={item.label}
                >
                  <Icon />
                </a>
              )
            })}
          </div>
        </nav>
      </header>

      <main>
        <motion.section
          id="hero"
          className="hero-section"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <HeroWireframe className="hero-wireframe" style={{ opacity: 0.3 }} />

          <motion.h1 variants={CHILD_VARIANTS}>VEDHA PRAMEEDH VADDEPALLY</motion.h1>
          <Typewriter className="hero-type mono" phrases={HERO_ROTATING_TEXT} />

          <motion.div variants={CHILD_VARIANTS} className="hero-ctas">
            <a className="cta interactive" href="#projects">
              View Projects
            </a>
            <a
              className="cta interactive"
              href={RESUME_PDF_URL}
              onClick={(event) => {
                event.preventDefault()
                openResumeDocument()
              }}
            >
              Download Resume
            </a>
          </motion.div>
        </motion.section>

        <section id="skills" className="section-block reveal-child" style={{ transitionDelay: '0s' }}>
          <div className="skills-scrim" aria-hidden="true" />
          <h2 className="reveal-child" style={{ transitionDelay: '0s' }}>
            TECHNICAL ARSENAL
          </h2>
          <div className="reveal-child" style={{ transitionDelay: '0.1s' }}>
            <ShakeToUnlock isMobile />
          </div>
        </section>

        <section id="experience" className="section-block reveal-child" style={{ transitionDelay: '0s' }}>
          <h2 className="reveal-child" style={{ transitionDelay: '0s' }}>
            EXPERIENCE
          </h2>
          <div className="reveal-child" style={{ transitionDelay: '0.1s' }}>
            <ExperienceCard />
          </div>
        </section>

        <section id="projects" className="section-block reveal-child" style={{ transitionDelay: '0s' }}>
          <h2 className="reveal-child" style={{ transitionDelay: '0s' }}>
            PROJECTS
          </h2>

          <div className="projects-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="project-column">
              {PROJECTS.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  pairIndex={-1}
                  hoveredProject={-1}
                  setHoveredProject={() => {}}
                  delay={index * 0.1}
                  disablePush
                  forceStaticTilt
                />
              ))}
            </div>
          </div>
        </section>

        <motion.section
          id="honors"
          className="section-block"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={CHILD_VARIANTS}>HONORS &amp; AWARDS</motion.h2>

          <div className="trophy-wall">
            <motion.article variants={CHILD_VARIANTS} className="trophy-card glass-panel shimmer">
              <h3>2nd Place · CBRE Sponsor Challenge</h3>
              <p>HackUTD 2025 · 1,204 participants · North America's largest 24hr hackathon</p>
            </motion.article>

            <motion.article variants={CHILD_VARIANTS} className="trophy-card glass-panel shimmer">
              <h3>2nd Place · AIMD Annual ML Challenge</h3>
              <p>Pediatric X-Ray Cancer Detection · 2025</p>
            </motion.article>
          </div>
        </motion.section>

        <section id="contact" className="section-block reveal-child" style={{ transitionDelay: '0s' }}>
          <h2 className="reveal-child" style={{ transitionDelay: '0s' }}>
            INITIALIZE CONTACT
          </h2>

          <div className="terminal glass-panel reveal-child" style={{ transitionDelay: '0.1s' }}>
            <p className="mono terminal-line">
              <span id="terminal-text">{contactText}</span>
              <span id="terminal-cursor" aria-hidden="true" />
            </p>

            <div className="contact-links reveal-child" style={{ transitionDelay: '0.2s' }}>
              {CONTACT_LINKS.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    className="contact-btn interactive reveal-child"
                    href={item.href}
                    target={item.label !== 'Email' ? '_blank' : undefined}
                    rel={item.label !== 'Email' ? 'noreferrer' : undefined}
                    style={{ transitionDelay: '0.1s' }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>

            <p className="mono reveal-child" style={{ transitionDelay: '0.3s' }}>
              Phone: 945-227-4038
            </p>
          </div>
        </section>
      </main>

      <footer className="mono">© 2026 Vedha Vaddepally · Built with React + Framer Motion · Dallas, TX</footer>
    </>
  )
}

export default AppMobile
