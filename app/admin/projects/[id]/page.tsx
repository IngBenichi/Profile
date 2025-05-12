import { getPortfolioData } from "@/lib/data"
import { notFound } from "next/navigation"
import ProjectForm from "@/components/admin/project-form"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const data = await getPortfolioData()

  // Handle "new" project case
  if (params.id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Add New Project</h1>
        <ProjectForm />
      </div>
    )
  }

  // Find existing project
  const projectId = Number.parseInt(params.id)
  const project = data.projects.find((p) => p.id === projectId)

  if (!project) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
