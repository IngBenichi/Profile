import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getPortfolioData } from "@/lib/data"
import ProjectList from "@/components/admin/project-list"

export default async function ProjectsPage() {
  const data = await getPortfolioData()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>
      <ProjectList projects={data.projects} />
    </div>
  )
}
