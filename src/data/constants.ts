import { NavigationItem, SocialLink } from '../types'

// Personal Information
export const PERSONAL_INFO = {
  name: 'Muhammad Ibraheem',
  firstName: 'Muhammad',
  lastName: 'Ibraheem',
  email: 'hello@iamibm.me',
  phone: '+92 XXX XXXXXXX',
  location: 'Lahore, Pakistan',
  title: 'Product Engineer',
  tagline: 'Building seamless products from concept to launch',
  bio: `I'm a Product Engineer who loves building things, from pixel-perfect UIs in React and Next.js to clean, scalable backends in Node.js and NestJS. I care about the full picture: performance, architecture, and the small interactions that make a product feel genuinely polished rather than just functional. I'm drawn to startups and SaaS companies building at the intersection of AI and great product experience where moving fast still means building things right.`,
  availability: 'Open to full-time and freelance opportunities',
}

// Navigation Items
export const NAV_ITEMS: NavigationItem[] = [
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Skills',
    href: '#skills',
  },
  {
    label: 'Projects',
    href: '#projects',
  },
  {
    label: 'Experience',
    href: '#experience',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
]

// Social Links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: 'github',
    label: 'View my code',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: 'linkedin',
    label: 'Connect with me',
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: 'email',
    label: 'Send me an email',
  },
]

// Site Metadata
export const SITE_METADATA = {
  title: 'Your Name - Front-End Developer Portfolio',
  description:
    'Front-end developer specializing in React, TypeScript, and modern web technologies. Building beautiful, functional user experiences.',
  keywords: [
    'front-end developer',
    'react developer',
    'typescript',
    'web developer',
    'portfolio',
    'UI developer',
  ],
  author: 'Your Name',
  siteUrl: 'https://yourportfolio.com',
  image: '/og-image.png',
}

// Resume
export const RESUME_URL = '/resume.pdf'
