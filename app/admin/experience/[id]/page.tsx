import { getPortfolioData } from "@/lib/data"
import { notFound } from "next/navigation"
import ExperienceForm from "@/components/admin/experience-form"

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const data = await getPortfolioData()

  // Handle "new" experience case
  if (params.id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Add New Experience</h1>
        <ExperienceForm />
      </div>
    )
  }

  // Find existing experience
  const experienceId = Number.parseInt(params.id)
  const experience = data.experience.find((e) => e.id === experienceId)

  if (!experience) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Experience</h1>
      <ExperienceForm experience={experience} />
    </div>
  )
}
