"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  MessageSquareQuote,
  Mail,
  LogOut,
  Layers,
  Code,
} from "lucide-react"
import { logout } from "@/app/actions/auth-actions"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Skills",
    href: "/admin/skills",
    icon: <Code className="mr-2 h-4 w-4" />,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: <Layers className="mr-2 h-4 w-4" />,
  },
  {
    title: "Experience",
    href: "/admin/experience",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
  {
    title: "Education",
    href: "/admin/education",
    icon: <GraduationCap className="mr-2 h-4 w-4" />,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: <MessageSquareQuote className="mr-2 h-4 w-4" />,
  },
  {
    title: "Contact",
    href: "/admin/contact",
    icon: <Mail className="mr-2 h-4 w-4" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/admin/login"
  }

  return (
    <div className="w-64 border-r border-border/40 bg-background min-h-screen p-4">
      <div className="flex items-center mb-8 px-2 py-3">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          Portfolio<span className="text-primary">Admin</span>
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
