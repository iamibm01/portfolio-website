import { Experience } from '../types'

export const experience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Mechanical Design Engineer',
    company: 'Tech Company',
    location: 'Lahore, Pakistan',
    startDate: '2020-01',
    endDate: '2023-12',
    current: false,
    description: 'Designed mechanical products from concept to manufacturing',
    responsibilities: [
      'Led design of 10+ products',
      'Collaborated with cross-functional teams',
      'Ensured precision in all deliverables',
    ],
    achievements: [
      'Reduced production time by 20%',
      'Won internal design excellence award',
    ],
  },
  {
    id: 'exp-2',
    role: 'Front-End Developer',
    company: 'Freelance',
    location: 'Remote',
    startDate: '2024-01',
    current: true,
    description: 'Building modern web applications with React and TypeScript',
    responsibilities: [
      'Develop responsive web applications',
      'Implement pixel-perfect designs',
      'Optimize for performance',
    ],
  },
  ]