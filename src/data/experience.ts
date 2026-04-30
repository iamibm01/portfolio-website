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
    achievements: [],
  },
  {
    id: 'exp-2',
    role: 'Freelance Full-Stack Engineer',
    company: 'Self-Employed',
    location: 'Remote',
    startDate: '2023-01',
    endDate: '2026-01',
    current: false,
    description:
      'Architected and delivered full-stack web applications and AI integrations for clients across multiple industries.',
    responsibilities: [
      'Architected and delivered 5 full-stack web applications end-to-end for clients across multiple industries, from system design and database schema to production deployment',
      'Built responsive, mobile-first UIs using React, Next.js, and Tailwind CSS with consistent cross-browser compatibility and accessibility standards',
      'Implemented smooth animations and micro-interactions using Framer Motion, elevating user experience and product feel across client projects',
      'Optimized frontend performance through lazy loading, code splitting, and Core Web Vitals improvements resulting in faster load times and better SEO scores',
      'Integrated AI APIs and built agentic workflow automations using LLM pipelines to streamline and automate client business processes',
      'Implemented authentication systems using JWT and OAuth 2.0, handling secure session management and third-party provider integrations',
      'Designed and optimized PostgreSQL database schemas, improving query performance through indexing strategies, caching layers, and efficient ORM usage with Prisma',
      'Deployed and managed production infrastructure across AWS, GCP, and Vercel, handling environment configuration, CI/CD pipelines, and scalability considerations',
      'Collaborated directly with clients to scope requirements, translate business needs into technical architecture, and iterate on feedback through to final delivery',
    ],
    achievements: [],
  },
]
