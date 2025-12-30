import { PERSONAL_INFO } from '../../data/constants'
import { HiLocationMarker, HiBriefcase } from 'react-icons/hi'
import CountUp from '../ui/CountUp'


function About() {
  // Add smooth scroll handler
  const handleSmoothScroll = function (e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <section
      id="about"
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            About Me
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden shadow-xl  hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <img
                src="/profile.jpg"
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover scale-150"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={2015} to={2024} duration={1} delay={0.1} />
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Started Coding
                </p>
              </div>
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={0} to={4} duration={1} delay={0.1} />+
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Projects
                </p>
              </div>
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={0} to={10000} duration={10} delay={0.1} />+
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Coffee Cups
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-body-lg text-light-text-primary dark:text-gray-300 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>

            <div className="space-y-3">
              {/* Location with Icon */}
              <div className="flex items-center gap-3">
                <HiLocationMarker className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
                <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                  {PERSONAL_INFO.location}
                </p>
              </div>

              {/* Availability with Icon */}
              <div className="flex items-center gap-3">
                <HiBriefcase className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
                <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                  {PERSONAL_INFO.availability}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={function (e) {
                  handleSmoothScroll(e, '#contact')
                }}
                className="inline-block px-8 py-3 bg-primary dark:bg-primary-light text-white font-medium rounded-full hover:bg-primary-dark dark:hover:bg-primary hover:shadow-lg transition-all"
              >
                Let's Work Together
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
