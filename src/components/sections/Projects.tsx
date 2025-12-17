import { projects } from '../../data/projects'

function Projects() {
  return (
    <section 
      id="projects" 
      className="min-h-screen flex items-center bg-white py-20"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-body-lg text-light-text-secondary">
            A selection of my recent work
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map(function(project) {
            return (
              <div 
                key={project.id}
                className="bg-light-bg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Project Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <p className="text-gray-400 font-heading">Project Image</p>
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-light-text-primary text-xl">
                    {project.title}
                  </h3>

                  <p className="text-body-base text-light-text-secondary">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(function(tech) {
                      return (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-white text-primary text-sm font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      )
                    })}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4 pt-2">
                    
                    {project.liveUrl && (
                        <a
                    
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
                      >
                        View Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-all"
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