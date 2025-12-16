import { NavigationItem, SocialLink } from '../types'

// Personal Information
export const PERSONAL_INFO = {
  name: 'Your Name',
  firstName: 'Your',
  lastName: 'Name',
  email: 'your.email@example.com',
  phone: '+92 XXX XXXXXXX',
  location: 'Lahore, Pakistan',
  title: 'Front-End Developer',
  tagline: 'Transforming ideas into pixel-perfect, interactive experiences',
  bio: `I'm a front-end developer with a unique background in mechanical product design. 
For years, I transformed concepts into tangible products - now I bring that same 
precision and creativity to building digital experiences.`,
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