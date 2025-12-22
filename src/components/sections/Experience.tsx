import { experience } from '../../data/experience'

function Experience() {
  return (
    <section
      id="experience"
      className="snap-start min-h-screen flex items-center bg-light-bg dark:bg-gray-800 py-20"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            My professional journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experience.map(function (exp) {
            return (
              <div
                key={exp.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-xl">
                      {exp.role}
                    </h3>
                    <p className="text-body-base text-primary dark:text-primary-light font-medium">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-body-sm text-light-text-secondary dark:text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>{exp.location}</p>
                    <p>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>

                <p className="text-body-base text-light-text-primary dark:text-gray-300 mb-4">
                  {exp.description}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-body-sm font-medium text-light-text-primary dark:text-white">
                    Key Responsibilities:
                  </p>
                  <ul className="space-y-1 ml-5">
                    {exp.responsibilities.map(function (responsibility, index) {
                      return (
                        <li
                          key={index}
                          className="text-body-sm text-light-text-secondary dark:text-gray-400 list-disc"
                        >
                          {responsibility}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-body-sm font-medium text-primary dark:text-primary-light">
                      Key Achievements:
                    </p>
                    <ul className="space-y-1 ml-5">
                      {exp.achievements.map(function (achievement, index) {
                        return (
                          <li
                            key={index}
                            className="text-body-sm text-light-text-secondary dark:text-gray-400 list-disc"
                          >
                            {achievement}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
