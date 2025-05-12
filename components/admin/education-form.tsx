"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createEducation, updateEducation, deleteEducation } from "@/app/actions/portfolio-actions"
import type { EducationData } from "@/lib/types"
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

const educationFormSchema = z.object({
  degree: z.string().min(2, { message: "Degree must be at least 2 characters." }),
  institution: z.string().min(2, { message: "Institution must be at least 2 characters." }),
  period: z.string().min(2, { message: "Period must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  courses: z.array(z.string()).min(1, { message: "Add at least one course." }),
})

type EducationFormValues = z.infer<typeof educationFormSchema>

export default function EducationForm({ education }: { education?: EducationData }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newCourse, setNewCourse] = useState("")

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: education
      ? {
          ...education,
        }
      : {
          degree: "",
          institution: "",
          period: "",
          description: "",
          courses: [],
        },
  })

  const addCourse = () => {
    if (newCourse.trim() !== "") {
      const currentCourses = form.getValues("courses")
      form.setValue("courses", [...currentCourses, newCourse.trim()])
      setNewCourse("")
    }
  }

  const removeCourse = (index: number) => {
    const currentCourses = form.getValues("courses")
    form.setValue(
      "courses",
      currentCourses.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: EducationFormValues) => {
    setIsSubmitting(true)
    try {
      if (education) {
        await updateEducation({ ...data, id: education.id })
        toast({
          title: "Education updated",
          description: "Your education has been updated successfully.",
        })
      } else {
        await createEducation(data)
        toast({
          title: "Education created",
          description: "Your new education has been created successfully.",
        })
        router.push("/admin/education")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your education.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!education) return

    setIsDeleting(true)
    try {
      await deleteEducation(education.id)
      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
      })
      router.push("/admin/education")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your education.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Master of Science in Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University of Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <Input placeholder="2014 - 2016" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your education, specialization, thesis, etc..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courses"
                render={() => (
                  <FormItem>
                    <FormLabel>Relevant Coursework</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {form.getValues("courses").map((course, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                          {course}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => removeCourse(index)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add course..."
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCourse()
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={addCourse}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>Add relevant courses you took during this education.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Education"
            )}
          </Button>

          {education && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Education"
                  )}
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
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </Form>
  )
}
