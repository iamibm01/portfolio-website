import { PERSONAL_INFO } from '../../data/constants'
import { HiLocationMarker, HiBriefcase } from 'react-icons/hi'

function About() {
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
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-2xl flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500 font-heading">Your Photo</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">2024</p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">Started Coding</p>
              </div>
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">4+</p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">Projects</p>
              </div>
              <div className="text-center p-4 bg-light-bg dark:bg-gray-800 rounded-xl">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">∞</p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">Coffee Cups</p>
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