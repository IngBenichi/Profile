import SkillsForm from "@/components/admin/skills-form"
import { getPortfolioData } from "@/lib/data"

export default async function SkillsPage() {
  const data = await getPortfolioData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Skills</h1>
      <SkillsForm skills={data.skills} />
    </div>
  )
}
