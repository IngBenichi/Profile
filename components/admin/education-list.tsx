"use client"

import type { EducationData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
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
import { deleteEducation } from "@/app/actions/portfolio-actions"
import { useRouter } from "next/navigation"

export default function EducationList({ educations }: { educations: EducationData[] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteEducation(id)
      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your education.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (educations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-4">No education entries found</h3>
        <Button asChild>
          <Link href="/admin/education/new">Add Your First Education</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {educations.map((education) => (
        <Card key={education.id} className="border-border/40">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{education.degree}</CardTitle>
                <CardDescription>{education.institution}</CardDescription>
              </div>
              <CardDescription className="text-muted-foreground">{education.period}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground mb-4">{education.description}</p>
            <div>
              <h4 className="text-sm font-medium mb-2">Relevant Coursework:</h4>
              <div className="flex flex-wrap gap-2">
                {education.courses.map((course, index) => (
                  <Badge key={index} variant="secondary">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/education/${education.id}`}>
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
                    This action cannot be undone. This will permanently delete this education entry from your portfolio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(education.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {deletingId === education.id ? "Deleting..." : "Delete"}
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
