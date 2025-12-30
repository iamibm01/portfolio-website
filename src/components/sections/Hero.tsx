import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
// import GridBackground from '../ui/GridBackground'
import GradientText from '../ui/GradientText'
import WavesBackground from '../ui/WavesBackground'

function Hero() {
  const handleSmoothScroll = function (e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
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
      {/* <GridBackground /> */}
      <WavesBackground />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-6">
          {/* Small Greeting - Fade In */}
          <p className="text-secondary font-medium text-body-lg dark:text-secondary-light animate-fade-in">
            Hi, I'm
          </p>

          {/* Large Name - Slide Up (delay 1) */}
          <h1 className="text-hero-md font-heading font-bold text-gray-900 dark:text-white animate-slide-up-delay-1">
                        <GradientText
              colors={['#FF6B35', '#F7931E', '#FFB380', '#06B6D4', '#3B82F6']}
              animationSpeed={5}
              className="text-hero-md font-heading font-bold"
            >
              {PERSONAL_INFO.name}
            </GradientText>
          </h1>

          {/* Job Title - Slide Up (delay 2) */}
          <h2 className="text-section-sm font-heading font-semibold text-primary dark:text-primary-light animate-slide-up-delay-2">
            {PERSONAL_INFO.title}
          </h2>

          {/* Tagline - Slide Up (delay 3) */}
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-3">
            {PERSONAL_INFO.tagline}
          </p>

          {/* CTA Buttons - Fade Scale */}
          <div className="flex gap-4 justify-center pt-4 animate-fade-scale-delay">
            <a
              href="#projects"
              onClick={function (e) {
                handleSmoothScroll(e, '#projects')
              }}
              className="px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a
              href="#contact"
              onClick={function (e) {
                handleSmoothScroll(e, '#contact')
              }}
              className="px-8 py-3 border-2 border-primary text-primary dark:border-primary-light dark:text-primary-light font-medium rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-white transition-all"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links - Stagger Animation */}
          <div className="flex gap-6 justify-center pt-8">
            {SOCIAL_LINKS.map(function (link, index) {
              const animationClass =
                index === 0
                  ? 'animate-stagger-1'
                  : index === 1
                    ? 'animate-stagger-2'
                    : 'animate-stagger-3'

              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all hover:scale-110 ${animationClass}`}
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
