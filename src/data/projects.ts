import { Project } from '../types'

// problem / built / result are DUMMY layout copy, and the screenshots are placeholders.
// Replace both with the real thing before launch.

export const projects: Project[] = [
  {
    id: 'saas-boilerplate',
    title: 'SaaS Boilerplate — Full-Stack Starter Kit',
    description:
      'A production-ready, fully modular SaaS boilerplate designed to serve as a scalable foundation for modern web applications. Features built-in auth, multi-tenancy, role-based access control, and billing integration out of the box.',
    image: '/images/saas-boilerplate.png',
    screenshot: '/images/saas-boilerplate-screenshot.svg',
    problem:
      'Every new SaaS idea starts with the same two weeks of plumbing: auth, teams, roles and billing, rebuilt from scratch each time.',
    built:
      'A modular Next.js and NestJS starter with multi-tenant auth, role-based access control and Stripe billing wired in, deployable to AWS with one command.',
    result:
      'New products go from empty repo to a signed-in, paying user in an afternoon instead of a fortnight.',
    technologies: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'AWS', 'Docker'],
    githubUrl: 'https://github.com/iamibm01/saas-boilerplate',
    status: 'in-progress',
    featured: true,
  },
  {
    id: 'neox',
    title: 'Neox — Social Media Platform',
    description:
      'A full-stack social media platform built with the scalability considerations of a large-scale production application. Includes posts, likes, comments, follows, and real-time notifications with a normalized PostgreSQL schema handling complex relational data.',
    image: '/images/neox.png',
    screenshot: '/images/neox-screenshot.svg',
    problem:
      'Most social app tutorials stop at a feed. Real platforms live or die on the relational data underneath: follows, notifications and counts that stay correct under load.',
    built:
      'A full-stack social platform with posts, likes, comments, follows and real-time notifications, on a normalized PostgreSQL schema designed for scale.',
    result:
      'Feeds and notification counts stay consistent with thousands of seeded users and concurrent writes.',
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'Prisma',
      'AWS',
    ],
    githubUrl: 'https://github.com/iamibm01/neox',
    status: 'in-progress',
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description:
      'A fully responsive portfolio with fluid animations and an AI-powered chatbot in the contact section that initiates conversations with potential clients, captures their details, and automatically emails both parties.',
    image: '/images/portfolio.png',
    screenshot: '/images/portfolio-screenshot.svg',
    problem:
      'A portfolio is usually a static brochure, and most visitors leave without ever getting in touch.',
    built:
      'This site: a fast, accessible React portfolio with an AI chatbot that starts the conversation, captures the visitor’s details and emails both sides.',
    result:
      'Visitors can ask questions and leave their details without ever opening an email client.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion', 'Groq API'],
    githubUrl: 'https://github.com/iamibm01/portfolio-website',
    status: 'completed',
    featured: false,
  },
]
