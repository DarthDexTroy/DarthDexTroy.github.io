import { useEffect, useState } from 'react'
import AppDesktop from './AppDesktop'
import AppMobile from './AppMobile'

function App() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768,
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile ? <AppMobile /> : <AppDesktop />
}

export default App
