import { Skill, SkillCategory } from '../types'

// Shown in the About section's looping strip, in this order
export const skills: Skill[] = [
  { name: 'Anthropic', category: SkillCategory.Other, icon: 'anthropic' },
  { name: 'OpenAI API', category: SkillCategory.Other, icon: 'openai' },
  { name: 'RAG Pipelines', category: SkillCategory.Other, icon: 'rag' },
  { name: 'AI Agents', category: SkillCategory.Other, icon: 'agents' },
  { name: 'Prompt Engineering', category: SkillCategory.Other, icon: 'prompts' },
  { name: 'n8n Automation', category: SkillCategory.Other, icon: 'n8n' },
  { name: 'TypeScript', category: SkillCategory.Frontend, icon: 'typescript' },
  { name: 'Next.js', category: SkillCategory.Frontend, icon: 'next.js' },
  { name: 'React', category: SkillCategory.Frontend, icon: 'react' },
  { name: 'Node.js', category: SkillCategory.Backend, icon: 'node' },
  { name: 'NestJS', category: SkillCategory.Backend, icon: 'nestjs' },
  { name: 'PostgreSQL', category: SkillCategory.Backend, icon: 'postgresql' },
  { name: 'Prisma', category: SkillCategory.Backend, icon: 'prisma' },
  { name: 'REST APIs', category: SkillCategory.Backend, icon: 'restapi' },
  { name: 'AWS', category: SkillCategory.Tools, icon: 'aws' },
  { name: 'Docker', category: SkillCategory.Tools, icon: 'docker' },
  { name: 'Git & CI/CD', category: SkillCategory.Tools, icon: 'git' },
]
