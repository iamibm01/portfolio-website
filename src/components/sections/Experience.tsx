import { experience } from '../../data/experience'

function Experience() {
  return (
    <section
      id="experience"
      className="snap-start min-h-screen flex items-center bg-light-bg dark:bg-gray-800 py-20 pt-24 relative overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            My professional journey
          </p>
        </div>

        {/* Experience Cards - Single Column */}
        <div className="max-w-4xl mx-auto space-y-4">
          {experience.map(function (exp) {
            return (
              <div
                key={exp.id}
                className="group bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-white/20 dark:border-gray-700/30"
              >
                {/* Compact View (Always Visible) */}
                <div className="p-6">
                  {/* Header - Horizontal Layout */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-lg mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-body-sm text-primary dark:text-primary-light font-medium">
                        {exp.company}
                      </p>
                    </div>

                    {/* Date & Location - Right Side */}
                    <div className="text-right text-xs text-light-text-secondary dark:text-gray-400 ml-4">
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {/* Description */}
                  <div className="relative">
                    <p className="text-body-sm text-light-text-primary dark:text-gray-300 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {exp.description}
                    </p>

                    {/* Hover Prompt - Only visible when collapsed */}
                    <div className="mt-3 group-hover:hidden">
                      <p className="text-xs text-primary dark:text-primary-light font-medium flex items-center gap-1 italic text-center">
                        Hover to see more
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details (Hidden, Shows on Hover) */}
                {/* Expanded Details (Hidden, Shows on Hover) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                      {/* Responsibilities */}
                      <div>
                        <p className="text-xs font-semibold text-light-text-primary dark:text-white mb-2 uppercase tracking-wide">
                          Responsibilities
                        </p>
                        <ul className="space-y-1.5">
                          {exp.responsibilities.map(function (responsibility, idx) {
                            return (
                              <li
                                key={idx}
                                className="text-sm text-light-text-secondary dark:text-gray-400 flex items-start"
                              >
                                <span className="text-primary dark:text-primary-light mr-2 mt-1">
                                  •
                                </span>
                                <span>{responsibility}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-primary dark:text-primary-light mb-2 uppercase tracking-wide">
                            Achievements
                          </p>
                          <ul className="space-y-1.5">
                            {exp.achievements.map(function (achievement, idx) {
                              return (
                                <li
                                  key={idx}
                                  className="text-sm text-light-text-secondary dark:text-gray-400 flex items-start"
                                >
                                  <span className="text-primary dark:text-primary-light mr-2 mt-1">
                                    ✓
                                  </span>
                                  <span>{achievement}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
