import PillNavbar from './components/layout/PillNavbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'

function App() {
  return (
    <div className="min-h-screen bg-light-bg">
      <PillNavbar />
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}

export default App
