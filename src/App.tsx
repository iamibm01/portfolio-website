import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'

function App() {
  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />

        {/* Keep remaining placeholder sections */}


        <section id="contact" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
              Contact
            </h2>
            <p className="text-body-base text-light-text-secondary">Contact form will be here</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
