import { projects } from '../../data/projects'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

function Projects() {
  return (
    <section
      id="projects"
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
    >
      {/* Large sparse amber dots — expansive, showcase feel */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f59e0b 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            A selection of my recent work
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map(function (project, index) {
            return (
              <motion.div
                key={project.id}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
                className="bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border border-white/40 dark:border-white/15"
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
                    {project.technologies.map(function (tech) {
                      return (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/40 dark:bg-white/10 backdrop-blur-md text-primary dark:text-primary-light text-sm font-medium rounded-full border border-white/30 dark:border-white/10"
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects
