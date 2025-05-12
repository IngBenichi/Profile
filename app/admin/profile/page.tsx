import ProfileForm from "@/components/admin/profile-form"
import { getPortfolioData } from "@/lib/data"

export default async function ProfilePage() {
  const data = await getPortfolioData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <ProfileForm profile={data.profile} />
    </div>
  )
}
