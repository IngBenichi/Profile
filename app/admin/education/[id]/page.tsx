import { getPortfolioData } from "@/lib/data"
import { notFound } from "next/navigation"
import EducationForm from "@/components/admin/education-form"

export default async function EditEducationPage({ params }: { params: { id: string } }) {
  const data = await getPortfolioData()

  // Handle "new" education case
  if (params.id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Add New Education</h1>
        <EducationForm />
      </div>
    )
  }

  // Find existing education
  const educationId = Number.parseInt(params.id)
  const education = data.education.find((e) => e.id === educationId)

  if (!education) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Education</h1>
      <EducationForm education={education} />
    </div>
  )
}
