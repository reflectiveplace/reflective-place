import Pantalla1 from './pages/pantalla1'
import Pantalla2 from './pages/pantalla2'
import Pantalla2b from './pages/pantalla2b'
import Pantalla3 from './pages/pantalla3'
import Pantalla4 from './pages/pantalla4'
import Pantalla5 from './pages/pantalla5'
import Pantalla6 from './pages/pantalla6'
import Pantalla6b from './pages/pantalla6b'
import Pantalla7 from './pages/pantalla7'
import Pantalla7b from './pages/pantalla7b'
import Pantalla8 from './pages/pantalla8'
import Pantalla8b from './pages/pantalla8b'
import Pantalla9 from './pages/pantalla9'
import Pantalla10 from './pages/pantalla10'
import Pantalla11 from './pages/pantalla11'
import Pantalla12 from './pages/pantalla12'
import Pantalla13 from './pages/pantalla13'
import Pantalla14 from './pages/pantalla14'
import Pantalla15 from './pages/pantalla15'
import Pantalla16 from './pages/pantalla16'

function App() {
  const screen = new URLSearchParams(window.location.search).get('pantalla')
  const navTarget = sessionStorage.getItem('navTarget')
  let allowScreen = !screen

  if (screen && navTarget === screen) {
    allowScreen = true
    sessionStorage.removeItem('navTarget')
  } else if (screen && navTarget !== screen) {
    try {
      const ref = document.referrer
      if (ref) {
        allowScreen = new URL(ref).origin === window.location.origin
      }
    } catch {
      allowScreen = false
    }
  }

  if (screen && !allowScreen) {
    window.history.replaceState(null, '', window.location.pathname)
    return <Pantalla1 />
  }

  if (screen === '2') return <Pantalla2 />
  if (screen === '2b') return <Pantalla2b />
  if (screen === '3') return <Pantalla3 />
  if (screen === '4') return <Pantalla4 />
  if (screen === '5') return <Pantalla5 />
  if (screen === '6') return <Pantalla6 />
  if (screen === '6b') return <Pantalla6b />
  if (screen === '7') return <Pantalla7 />
  if (screen === '7b') return <Pantalla7b />
  if (screen === '8') return <Pantalla8 />
  if (screen === '8b') return <Pantalla8b />
  if (screen === '9') return <Pantalla9 />
  if (screen === '10') return <Pantalla10 />
  if (screen === '11') return <Pantalla11 />
  if (screen === '12') return <Pantalla12 />
  if (screen === '13') return <Pantalla13 />
  if (screen === '14') return <Pantalla14 />
  if (screen === '15') return <Pantalla15 />
  if (screen === '16') return <Pantalla16 />
  return <Pantalla1 />
}

export default App
