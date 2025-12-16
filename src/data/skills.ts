import { Skill, SkillCategory, SkillLevel } from '../types'

export const skills: Skill[] = [
  {
    name: 'React',
    category: SkillCategory.Frontend,
    level: SkillLevel.Intermediate,
    icon: 'react',
  },
  {
    name: 'TypeScript',
    category: SkillCategory.Frontend,
    level: SkillLevel.Intermediate,
    icon: 'typescript',
  },
  {
    name: 'Tailwind CSS',
    category: SkillCategory.Frontend,
    level: SkillLevel.Beginner,
    icon: 'tailwind',
  },
  {
    name: 'Git',
    category: SkillCategory.Tools,
    level: SkillLevel.Intermediate,
    icon: 'git',
  },
]
