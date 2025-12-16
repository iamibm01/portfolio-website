import { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'taskflow-pro',
    title: 'TaskFlow Pro',
    description: 'A modern task management app with drag-and-drop functionality',
    image: '/images/taskflow.png',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://taskflow-demo.com',
    githubUrl: 'https://github.com/yourusername/taskflow',
    status: 'completed',
    featured: true,
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with animated backgrounds',
    image: '/images/weather.png',
    technologies: ['React', 'OpenWeather API', 'CSS'],
    githubUrl: 'https://github.com/yourusername/weather',
    status: 'in-progress',
    featured: false,
  },
]