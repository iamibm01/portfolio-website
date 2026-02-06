import { projects } from '../../data/projects'

function Projects() {
  return (
<section
  id="projects"
  className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
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
        Featured Projects
      </h2>
      <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
        A selection of my recent work
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {projects.map(function(project) {
        return (
          <div 
            key={project.id}
            className="bg-light-bg dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500 font-heading">Project Image</p>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-xl">
                {project.title}
              </h3>

              <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map(function(tech) {
                  return (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-white dark:bg-gray-900 text-primary dark:text-primary-light text-sm font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  )
                })}
              </div>

              <div className="flex gap-4 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-primary dark:bg-primary-light text-white font-medium rounded-full hover:bg-primary-dark dark:hover:bg-primary transition-colors"
                  >
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 border-2 border-primary dark:border-primary-light text-primary dark:text-primary-light font-medium rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-white transition-all"
                  >
                    View Code
                  </a>
                )}
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

export default Projects
