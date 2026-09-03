"use server"

import { revalidatePath } from "next/cache"
import { getPortfolioData, savePortfolioData } from "@/lib/data"
import type {
  ProfileData,
  ProjectData,
  ExperienceData,
  EducationData,
  TestimonialData,
  SkillsData,
  ContactData,
} from "@/lib/types"

// Profile actions
export async function updateProfile(profile: ProfileData) {
  const data = await getPortfolioData()
  const updatedData = {
    ...data,
    profile: {
      ...data.profile,
      ...profile,
    },
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/profile")
  return { success: true }
}

// Project actions
export async function createProject(project: Omit<ProjectData, "id">) {
  const data = await getPortfolioData()
  const newId = data.projects.length > 0 ? Math.max(...data.projects.map((p) => p.id)) + 1 : 1
  const newProject = {
    ...project,
    id: newId,
  }
  const updatedData = {
    ...data,
    projects: [...data.projects, newProject],
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/projects")
  return { success: true, id: newId }
}

export async function updateProject(project: ProjectData) {
  const data = await getPortfolioData()
  const updatedProjects = data.projects.map((p) => (p.id === project.id ? project : p))
  const updatedData = {
    ...data,
    projects: updatedProjects,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/projects")
  revalidatePath(`/admin/projects/${project.id}`)
  return { success: true }
}

export async function deleteProject(id: number) {
  const data = await getPortfolioData()
  const updatedProjects = data.projects.filter((p) => p.id !== id)
  const updatedData = {
    ...data,
    projects: updatedProjects,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/projects")
  return { success: true }
}

// Experience actions
export async function createExperience(experience: Omit<ExperienceData, "id">) {
  const data = await getPortfolioData()
  const newId = data.experience.length > 0 ? Math.max(...data.experience.map((e) => e.id)) + 1 : 1
  const newExperience = {
    ...experience,
    id: newId,
  }
  const updatedData = {
    ...data,
    experience: [...data.experience, newExperience],
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/experience")
  return { success: true, id: newId }
}

export async function updateExperience(experience: ExperienceData) {
  const data = await getPortfolioData()
  const updatedExperiences = data.experience.map((e) => (e.id === experience.id ? experience : e))
  const updatedData = {
    ...data,
    experience: updatedExperiences,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/experience")
  revalidatePath(`/admin/experience/${experience.id}`)
  return { success: true }
}

export async function deleteExperience(id: number) {
  const data = await getPortfolioData()
  const updatedExperiences = data.experience.filter((e) => e.id !== id)
  const updatedData = {
    ...data,
    experience: updatedExperiences,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/experience")
  return { success: true }
}

// Education actions
export async function createEducation(education: Omit<EducationData, "id">) {
  const data = await getPortfolioData()
  const newId = data.education.length > 0 ? Math.max(...data.education.map((e) => e.id)) + 1 : 1
  const newEducation = {
    ...education,
    id: newId,
  }
  const updatedData = {
    ...data,
    education: [...data.education, newEducation],
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/education")
  return { success: true, id: newId }
}

export async function updateEducation(education: EducationData) {
  const data = await getPortfolioData()
  const updatedEducations = data.education.map((e) => (e.id === education.id ? education : e))
  const updatedData = {
    ...data,
    education: updatedEducations,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/education")
  revalidatePath(`/admin/education/${education.id}`)
  return { success: true }
}

export async function deleteEducation(id: number) {
  const data = await getPortfolioData()
  const updatedEducations = data.education.filter((e) => e.id !== id)
  const updatedData = {
    ...data,
    education: updatedEducations,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/education")
  return { success: true }
}

// Testimonial actions
export async function createTestimonial(testimonial: Omit<TestimonialData, "id">) {
  const data = await getPortfolioData()
  const newId = data.testimonials.length > 0 ? Math.max(...data.testimonials.map((t) => t.id)) + 1 : 1
  const newTestimonial = {
    ...testimonial,
    id: newId,
  }
  const updatedData = {
    ...data,
    testimonials: [...data.testimonials, newTestimonial],
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
  return { success: true, id: newId }
}

export async function updateTestimonial(testimonial: TestimonialData) {
  const data = await getPortfolioData()
  const updatedTestimonials = data.testimonials.map((t) => (t.id === testimonial.id ? testimonial : t))
  const updatedData = {
    ...data,
    testimonials: updatedTestimonials,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
  revalidatePath(`/admin/testimonials/${testimonial.id}`)
  return { success: true }
}

export async function deleteTestimonial(id: number) {
  const data = await getPortfolioData()
  const updatedTestimonials = data.testimonials.filter((t) => t.id !== id)
  const updatedData = {
    ...data,
    testimonials: updatedTestimonials,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
  return { success: true }
}

// Skills actions
export async function updateSkills(skills: SkillsData) {
  const data = await getPortfolioData()
  const updatedData = {
    ...data,
    skills,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/skills")
  return { success: true }
}

// Contact actions
export async function updateContact(contact: ContactData) {
  const data = await getPortfolioData()
  const updatedData = {
    ...data,
    contact,
  }
  await savePortfolioData(updatedData)
  revalidatePath("/")
  revalidatePath("/admin/contact")
  return { success: true }
}
