import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getPortfolioData } from "@/lib/data"
import ExperienceList from "@/components/admin/experience-list"

export default async function ExperiencePage() {
  const data = await getPortfolioData()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Work Experience</h1>
        <Button asChild>
          <Link href="/admin/experience/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Experience
          </Link>
        </Button>
      </div>
      <ExperienceList experiences={data.experience} />
    </div>
  )
}
