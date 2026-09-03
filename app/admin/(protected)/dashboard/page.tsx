import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPortfolioData } from "@/lib/data"
import { Layers, Users, Briefcase, GraduationCap, MessageSquareQuote, Mail } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const data = await getPortfolioData()

  const sections = [
    {
      title: "Profile",
      description: "Update your personal information and profile picture",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/admin/profile",
      count: 1,
    },
    {
      title: "Skills",
      description: "Manage your technical skills and expertise",
      icon: <Layers className="h-8 w-8 text-primary" />,
      link: "/admin/skills",
      count: Object.keys(data.skills).length,
    },
    {
      title: "Projects",
      description: "Add, edit or remove your portfolio projects",
      icon: <Layers className="h-8 w-8 text-primary" />,
      link: "/admin/projects",
      count: data.projects.length,
    },
    {
      title: "Experience",
      description: "Update your work experience history",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      link: "/admin/experience",
      count: data.experience.length,
    },
    {
      title: "Education",
      description: "Manage your educational background",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      link: "/admin/education",
      count: data.education.length,
    },
    {
      title: "Testimonials",
      description: "Add or edit testimonials from colleagues and clients",
      icon: <MessageSquareQuote className="h-8 w-8 text-primary" />,
      link: "/admin/testimonials",
      count: data.testimonials.length,
    },
    {
      title: "Contact",
      description: "Update your contact information",
      icon: <Mail className="h-8 w-8 text-primary" />,
      link: "/admin/contact",
      count: 1,
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your portfolio admin panel. Use the sections below to update your portfolio content.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link href={section.link} key={section.title}>
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-border/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  {section.count}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10">{section.icon}</div>
                  <CardDescription className="flex-1">{section.description}</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
