import { skills } from '../../data/skills'
import { SkillCategory } from '../../types'

function Skills() {
  // Group skills by category
  const frontendSkills = skills.filter(function(skill) {
    return skill.category === SkillCategory.Frontend
  })
  
  const toolsSkills = skills.filter(function(skill) {
    return skill.category === SkillCategory.Tools
  })

  return (
    <section 
      id="skills" 
      className="min-h-screen flex items-center bg-light-bg py-20"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary mb-4">
            Skills & Technologies
          </h2>
          <p className="text-body-lg text-light-text-secondary">
            Tools I use to bring ideas to life
          </p>
        </div>

        {/* Frontend Skills */}
        <div className="mb-12">
          <h3 className="text-card-md font-heading font-semibold text-light-text-primary mb-6 text-center">
            Frontend Development
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {frontendSkills.map(function(skill) {
              return (
                <div 
                  key={skill.name}
                  className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow w-40"
                >
                  <p className="font-heading font-semibold text-light-text-primary text-lg mb-2">
                    {skill.name}
                  </p>
                  <p className="text-xs text-light-text-secondary">
                    {skill.level}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tools & Workflow */}
        <div>
          <h3 className="text-card-md font-heading font-semibold text-light-text-primary mb-6 text-center">
            Tools & Workflow
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {toolsSkills.map(function(skill) {
              return (
                <div 
                  key={skill.name}
                  className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow w-40"
                >
                  <p className="font-heading font-semibold text-light-text-primary text-lg mb-2">
                    {skill.name}
                  </p>
                  <p className="text-xs text-light-text-secondary">
                    {skill.level}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills