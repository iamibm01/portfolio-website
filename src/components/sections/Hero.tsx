import { PERSONAL_INFO } from '../../data/constants'
import { socialLinks } from '../../data/socialLinks'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import GradientText from '../ui/GradientText'

function Hero() {
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
      className="min-h-[100svh] flex items-center justify-center pt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-6">
          {/* Small Greeting - Fade In */}
          <p className="text-accent font-medium text-base animate-fade-in">Hi, I'm</p>

          {/* Large Name - Slide Up (delay 1) */}
          <h1 className="text-[2.25rem] md:text-hero-sm font-medium text-ink animate-slide-up-delay-1">
            <GradientText
              colors={['#FF6B35', '#F7931E', '#FFB380', '#06B6D4', '#3B82F6']}
              animationSpeed={5}
              className="text-[2.25rem] md:text-hero-sm font-medium"
            >
              {PERSONAL_INFO.name}
            </GradientText>
          </h1>

          {/* Job Title - Slide Up (delay 2) */}
          <h2 className="text-xl md:text-section-sm font-semibold text-accent animate-slide-up-delay-2">
            {PERSONAL_INFO.title}
          </h2>

          {/* Tagline - Slide Up (delay 3) */}
          <p className="text-base text-muted max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-3">
            {PERSONAL_INFO.tagline}
          </p>

          {/* CTA Buttons - Fade Scale */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-scale-delay">
            <a
              href="#projects"
              className="px-8 py-3 bg-gradient-hero text-on-accent font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-on-accent transition-all"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links - Stagger Animation */}
          <div className="flex gap-6 justify-center pt-8">
            {socialLinks.map(function (link, index) {
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
                  className={`text-muted hover:text-accent transition-all hover:scale-110 ${animationClass}`}
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
