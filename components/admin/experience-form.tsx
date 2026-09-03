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
import { createExperience, updateExperience, deleteExperience } from "@/app/actions/portfolio-actions"
import type { ExperienceData } from "@/lib/types"
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

const experienceFormSchema = z.object({
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
  period: z.string().min(2, { message: "Period must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  achievements: z.array(z.string()).min(1, { message: "Add at least one achievement." }),
})

type ExperienceFormValues = z.infer<typeof experienceFormSchema>

export default function ExperienceForm({ experience }: { experience?: ExperienceData }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: experience
      ? {
          ...experience,
        }
      : {
          company: "",
          position: "",
          period: "",
          description: "",
          achievements: [],
        },
  })

  const addAchievement = () => {
    if (newAchievement.trim() !== "") {
      const currentAchievements = form.getValues("achievements")
      form.setValue("achievements", [...currentAchievements, newAchievement.trim()])
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements")
    form.setValue(
      "achievements",
      currentAchievements.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true)
    try {
      if (experience) {
        await updateExperience({ ...data, id: experience.id })
        toast({
          title: "Experience updated",
          description: "Your experience has been updated successfully.",
        })
      } else {
        await createExperience(data)
        toast({
          title: "Experience created",
          description: "Your new experience has been created successfully.",
        })
        router.push("/admin/experience")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your experience.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!experience) return

    setIsDeleting(true)
    try {
      await deleteExperience(experience.id)
      toast({
        title: "Experience deleted",
        description: "Your experience has been deleted successfully.",
      })
      router.push("/admin/experience")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your experience.",
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="TechCorp Solutions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Backend Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <FormControl>
                      <Input placeholder="2020 - Present" {...field} />
                    </FormControl>
                    <FormDescription>The time period you worked at this company.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your role and responsibilities..."
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
                name="achievements"
                render={() => (
                  <FormItem>
                    <FormLabel>Key Achievements</FormLabel>
                    <div className="space-y-2 mt-2 mb-3">
                      {form.getValues("achievements").map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 p-2 bg-muted/50 rounded-md">{achievement}</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeAchievement(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add achievement..."
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addAchievement()
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={addAchievement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>List your key achievements and contributions in this role.</FormDescription>
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
              "Save Experience"
            )}
          </Button>

          {experience && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Experience"
                  )}
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
