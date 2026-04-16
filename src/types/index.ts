// Social media link interface
export interface SocialLink {
  name: string
  url: string
  icon: string
  label?: string
}
// Navigation item interface
export interface NavigationItem {
  label: string
  href: string
}

// Skill proficiency levels
export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

// Skill category
export enum SkillCategory {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Tools = 'Tools',
  Design = 'Design',
  Other = 'Other',
}

// Skill interface
export interface Skill {
  name: string
  category: SkillCategory
  level: SkillLevel
  icon?: string
}
// Project status
export type ProjectStatus = 'completed' | 'in-progress' | 'planned'

// Project interface
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  status: ProjectStatus
  featured: boolean
}
// Work experience interface
export interface Experience {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  responsibilities: string[]
  achievements?: string[]
}

// ── AI Chatbot ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export type ReceiptStatus = 'sent' | 'delivered' | 'seen'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  receiptStatus?: ReceiptStatus
}

export interface LeadData {
  name: string
  email: string
  /** Full conversation summary sent in the notification email */
  conversationSummary: string
}

export type ChatStatus = 'idle' | 'loading' | 'error' | 'lead_captured'

export interface ChatState {
  messages: Message[]
  status: ChatStatus
  lead: LeadData | null
  errorMessage: string | null
}
