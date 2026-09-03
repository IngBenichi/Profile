import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getPortfolioData } from "@/lib/data"
import EducationList from "@/components/admin/education-list"

export default async function EducationPage() {
  const data = await getPortfolioData()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Education</h1>
        <Button asChild>
          <Link href="/admin/education/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Education
          </Link>
        </Button>
      </div>
      <EducationList educations={data.education} />
    </div>
  )
}
