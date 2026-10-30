import { PERSONAL_INFO } from '../../data/constants'
import { socialLinks } from '../../data/socialLinks'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import ProjectCarousel from '../ui/ProjectCarousel'

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
    // Left padding matches max-w-7xl px-6 elsewhere; no right padding so the carousel bleeds off the edge
    <section
      id="hero"
      className="min-h-[100svh] flex items-center pt-28 pb-16 lg:pt-20 lg:pb-0 relative overflow-hidden pl-[max(1.5rem,calc((100%_-_80rem)/2_+_1.5rem))]"
    >
      <div className="w-full grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
        <div className="pr-6 lg:pr-0 space-y-6 relative z-10">
          {/* Large Name - Slide Up (delay 1) */}
          <h1 className="text-display font-bold text-accent animate-slide-up-delay-1">
            {PERSONAL_INFO.name}
          </h1>

          {/* Job Title - Slide Up (delay 2) */}
          <p className="text-lead font-semibold text-ink animate-slide-up-delay-2">
            {PERSONAL_INFO.title}
          </p>

          {/* Tagline - Slide Up (delay 3) */}
          <p className="text-base text-muted max-w-md leading-relaxed animate-slide-up-delay-3">
            {PERSONAL_INFO.tagline}
          </p>

          {/* CTA Buttons - Fade Scale */}
          <div className="flex flex-wrap gap-4 pt-2 animate-fade-scale-delay">
            <a
              href="#projects"
              className="inline-flex items-center min-h-12 px-8 bg-accent text-on-accent font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center min-h-12 px-8 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-on-accent transition-all"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links - Stagger Animation; padding gives 44px targets, -ml keeps icons on the text edge */}
          <div className="flex gap-2 -ml-2.5 pt-2">
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
                  className={`p-2.5 text-muted hover:text-accent transition-all hover:scale-110 ${animationClass}`}
                  aria-label={link.label ?? link.name}
                >
                  {getIcon(link.name)}
                </a>
              )
            })}
          </div>
        </div>

        <div className="min-w-0 animate-fade-scale-delay">
          <ProjectCarousel />
        </div>
      </div>
    </section>
  )
}

export default Hero
