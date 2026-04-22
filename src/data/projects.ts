import { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'saas-boilerplate',
    title: 'SaaS Boilerplate — Full-Stack Starter Kit',
    description:
      'A production-ready, fully modular SaaS boilerplate designed to serve as a scalable foundation for modern web applications. Features built-in auth, multi-tenancy, role-based access control, and billing integration out of the box.',
    image: '/images/saas-boilerplate.png',
    technologies: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'AWS', 'Docker'],
    liveUrl: 'https://your-boilerplate-demo.com',
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
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Prisma', 'AWS'],
    liveUrl: 'https://neox.app',
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
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion', 'Groq API'],
    liveUrl: 'https://muhammadibraheem.com',
    githubUrl: 'https://github.com/iamibm01/portfolio-website',
    status: 'completed',
    featured: false,
  },
]