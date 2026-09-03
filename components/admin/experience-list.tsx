"use client"

import type { ExperienceData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, CheckCircle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { deleteExperience } from "@/app/actions/portfolio-actions"
import { useRouter } from "next/navigation"

export default function ExperienceList({ experiences }: { experiences: ExperienceData[] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteExperience(id)
      toast({
        title: "Experience deleted",
        description: "Your experience has been deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your experience.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-4">No experience entries found</h3>
        <Button asChild>
          <Link href="/admin/experience/new">Add Your First Experience</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience) => (
        <Card key={experience.id} className="border-border/40">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{experience.position}</CardTitle>
                <CardDescription className="text-primary">{experience.company}</CardDescription>
              </div>
              <CardDescription className="text-muted-foreground px-3 py-1 bg-muted rounded-full text-sm">
                {experience.period}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground mb-4">{experience.description}</p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Achievements:</h4>
              <ul className="space-y-1">
                {experience.achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
                {experience.achievements.length > 2 && (
                  <li className="text-sm text-muted-foreground">
                    +{experience.achievements.length - 2} more achievements
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/experience/${experience.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this experience entry from your
                    portfolio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(experience.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {deletingId === experience.id ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
