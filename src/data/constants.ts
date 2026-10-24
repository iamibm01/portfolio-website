import { NavigationItem } from '../types'

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
