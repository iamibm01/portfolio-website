import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

function Hero() {
  // Icon mapping
  const getIcon = function (name: string) {
    switch (name.toLowerCase()) {
      case 'github':
        return <FaGithub className="w-6 h-6" />
      case 'linkedin':
        return <FaLinkedin className="w-6 h-6" />
      case 'email':
        return <FaEnvelope className="w-6 h-6" />
      default:
        return null
    }
  }

  return (
    <section
      id="hero"
      className="snap-start min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 pt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-6">
          <p className="text-secondary font-medium text-body-lg dark:text-secondary-light">
            Hi, I'm
          </p>

          <h1 className="text-hero-md font-heading font-bold text-gray-900 dark:text-white">
            {PERSONAL_INFO.name}
          </h1>

          <h2 className="text-section-sm font-heading font-semibold text-primary dark:text-primary-light">
            {PERSONAL_INFO.title}
          </h2>

          <p className="text-body-lg text-light-text-secondary dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {PERSONAL_INFO.tagline}
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-primary text-primary dark:border-primary-light dark:text-primary-light font-medium rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-white transition-all"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links with Icons */}
          <div className="flex gap-6 justify-center pt-8">
            {SOCIAL_LINKS.map(function (link) {
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all hover:scale-110"
                  aria-label={link.label}
                >
                  {getIcon(link.name)}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
