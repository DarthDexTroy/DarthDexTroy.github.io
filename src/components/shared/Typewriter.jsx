import { useEffect, useState } from 'react'

function Typewriter({ phrases, speed = 80, pause = 1600, className = '' }) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length]
    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1))
          if (text.length + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause)
          }
        } else {
          setText(current.slice(0, Math.max(text.length - 1, 0)))
          if (text.length === 0) {
            setDeleting(false)
            setPhraseIndex((prev) => prev + 1)
          }
        }
      },
      isDeleting ? speed / 2 : speed,
    )

    return () => window.clearTimeout(timeout)
  }, [isDeleting, pause, phraseIndex, phrases, speed, text])

  return (
    <div className={className}>
      {text}
      <span className="cursor-blink">|</span>
    </div>
  )
}

export default Typewriter
