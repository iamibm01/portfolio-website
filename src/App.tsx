import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'

function App() {
  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar />
      
      <main>
        <Hero />
        <About />

        {/* Keep the other placeholder sections */}
        <section id="skills" className="min-h-screen flex items-center justify-center bg-light-bg">
          <div className="text-center">
            <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
              Skills
            </h2>
            <p className="text-body-base text-light-text-secondary">
              Your technical skills will be displayed here
            </p>
          </div>
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
              Projects
            </h2>
            <p className="text-body-base text-light-text-secondary">
              Your portfolio projects will be showcased here
            </p>
          </div>
        </section>

        <section id="experience" className="min-h-screen flex items-center justify-center bg-light-bg">
          <div className="text-center">
            <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
              Experience
            </h2>
            <p className="text-body-base text-light-text-secondary">
              Your work history will go here
            </p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
              Contact
            </h2>
            <p className="text-body-base text-light-text-secondary">
              Contact form will be here
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App