export interface ProfileData {
  name: string
  title: string
  description: string
  about: string
  profileImage: string
}

export interface ProjectData {
  id: number
  title: string
  role: string
  description: string
  technologies: string[]
  features: string[]
  githubUrl: string
  demoUrl: string
  imageUrl: string
}

export interface ExperienceData {
  id: number
  company: string
  position: string
  period: string
  description: string
  achievements: string[]
}

export interface EducationData {
  id: number
  degree: string
  institution: string
  period: string
  description: string
  courses: string[]
}

export interface TestimonialData {
  id: number
  quote: string
  author: string
  position: string
}

export interface SkillsData {
  languages: string[]
  frameworks: string[]
  databases: string[]
  tools: string[]
}

export interface ContactData {
  email: string
  linkedin: string
  github: string
  lookingForWork: string
}

export interface PortfolioData {
  profile: ProfileData
  skills: SkillsData
  projects: ProjectData[]
  experience: ExperienceData[]
  education: EducationData[]
  testimonials: TestimonialData[]
  contact: ContactData
}
