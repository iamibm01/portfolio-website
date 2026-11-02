import { Experience } from '../types'

export const experience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Software Engineer',
    company: 'Resumize',
    location: 'Remote',
    startDate: '2026-02',
    endDate: undefined,
    current: true,
    description: 'Building core product features for an AI-powered resume builder SaaS.',
    responsibilities: [
      'Built a full-stack AI diff view feature with custom comparison logic, enabling users to compare original and AI-enhanced resume content side by side with granular controls to accept or reject individual bullet point changes',
      'Developed the job board integration flow — clicking "Craft Resume" saves the job to the database and redirects users directly into the app in build mode with the job pre-loaded',
      'Resolved database migration issues affecting production data integrity',
    ],
  },
  {
    id: 'exp-2',
    role: 'Freelance Full-Stack Engineer',
    company: 'Self-Employed',
    location: 'Remote',
    startDate: '2023-01',
    endDate: '2026-01',
    current: false,
    description: 'Independent client work across industries, from system design to production.',
    responsibilities: [
      'Architected and delivered 5 full-stack web applications end-to-end for clients across multiple industries, from system design and database schema to production deployment',
      'Integrated AI APIs and built agentic workflow automations using LLM pipelines to streamline and automate client business processes',
      'Implemented authentication systems using JWT and OAuth 2.0, handling secure session management and third-party provider integrations',
      'Designed and optimized PostgreSQL database schemas, improving query performance through indexing strategies, caching layers, and efficient ORM usage with Prisma',
    ],
  },
]
