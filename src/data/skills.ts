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
    name: 'Tailwind',
    category: SkillCategory.Frontend,
    level: SkillLevel.Beginner,
    icon: 'tailwind',
  },
  {
    name: 'HTML',
    category: SkillCategory.Frontend,
    level: SkillLevel.Beginner,
    icon: 'html',
  },
  {
    name: 'Javascript',
    category: SkillCategory.Frontend,
    level: SkillLevel.Beginner,
    icon: 'javascript',
  },
  {
    name: 'Next.js',
    category: SkillCategory.Frontend,
    level: SkillLevel.Beginner,
    icon: 'next.js',
  },

  // Backend
  {
    name: 'Node.js',
    category: SkillCategory.Backend,
    level: SkillLevel.Beginner,
    icon: 'node',
  },
  {
    name: 'Express',
    category: SkillCategory.Backend,
    level: SkillLevel.Beginner,
    icon: 'express',
  },
  {
    name: 'Prisma',
    category: SkillCategory.Backend,
    level: SkillLevel.Beginner,
    icon: 'prisma',
  },
  {
    name: 'PostgreSQL',
    category: SkillCategory.Backend,
    level: SkillLevel.Beginner,
    icon: 'postgresql',
  },
  {
    name: 'RESTful API',
    category: SkillCategory.Backend,
    level: SkillLevel.Beginner,
    icon: 'restapi',
  },

  // Tools
  {
    name: 'Git',
    category: SkillCategory.Tools,
    level: SkillLevel.Intermediate,
    icon: 'git',
  },
  {
    name: 'Vite',
    category: SkillCategory.Tools,
    level: SkillLevel.Beginner,
    icon: 'vite',
  },
  {
    name: 'Slack',
    category: SkillCategory.Tools,
    level: SkillLevel.Beginner,
    icon: 'slack',
  },
  {
    name: 'Notion',
    category: SkillCategory.Tools,
    level: SkillLevel.Beginner,
    icon: 'notion',
  },
]
