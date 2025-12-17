import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'

function Hero() {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          
          {/* Small Greeting */}
          <p className="text-secondary font-medium text-body-lg">
            Hi, I'm
          </p>
          
          {/* Large Name */}
          <h1 className="text-hero-md font-heading font-bold text-gray-900">
            {PERSONAL_INFO.name}
          </h1>
          
          {/* Job Title */}
          <h2 className="text-section-sm font-heading font-semibold text-primary">
            {PERSONAL_INFO.title}
          </h2>
          
          {/* Tagline */}
          <p className="text-body-lg text-light-text-secondary max-w-2xl mx-auto leading-relaxed">
            {PERSONAL_INFO.tagline}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <a 
              href="#projects" 
              className="px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-gradient-hero text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              Get In Touch
            </a>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-6 justify-center pt-8">
            {SOCIAL_LINKS.map(function(link) {
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <span className="text-sm font-medium">{link.name}</span>
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