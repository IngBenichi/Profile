"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, X, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createProject, updateProject, deleteProject } from "@/app/actions/portfolio-actions"
import type { ProjectData } from "@/lib/types"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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

const projectFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  technologies: z.array(z.string()).min(1, { message: "Add at least one technology." }),
  features: z.array(z.string()).min(1, { message: "Add at least one feature." }),
  githubUrl: z.string().url({ message: "Please enter a valid URL." }),
  demoUrl: z.string().url({ message: "Please enter a valid URL." }),
  imageUrl: z.string(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

export default function ProjectForm({ project }: { project?: ProjectData }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [newTechnology, setNewTechnology] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          ...project,
        }
      : {
          title: "",
          role: "",
          description: "",
          technologies: [],
          features: [],
          githubUrl: "https://github.com/",
          demoUrl: "https://",
          imageUrl: "/placeholder.svg?height=300&width=600",
        },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
        form.setValue("imageUrl", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTechnology = () => {
    if (newTechnology.trim() !== "") {
      const currentTechnologies = form.getValues("technologies")
      form.setValue("technologies", [...currentTechnologies, newTechnology.trim()])
      setNewTechnology("")
    }
  }

  const removeTechnology = (index: number) => {
    const currentTechnologies = form.getValues("technologies")
    form.setValue(
      "technologies",
      currentTechnologies.filter((_, i) => i !== index),
    )
  }

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      const currentFeatures = form.getValues("features")
      form.setValue("features", [...currentFeatures, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features")
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    try {
      if (project) {
        await updateProject({ ...data, id: project.id })
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        })
      } else {
        await createProject(data)
        toast({
          title: "Project created",
          description: "Your new project has been created successfully.",
        })
        router.push("/admin/projects")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your project.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return

    setIsDeleting(true)
    try {
      await deleteProject(project.id)
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      })
      router.push("/admin/projects")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your project.",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E-commerce API" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Backend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of the project..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <FormLabel>Project Image</FormLabel>
                <div className="mt-2 flex flex-col">
                  <div className="relative h-48 w-full rounded-md overflow-hidden border border-border mb-4">
                    <Image
                      src={previewImage || form.getValues("imageUrl") || "/placeholder.svg?height=300&width=600"}
                      alt="Project"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="project-image"
                              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> project image
                                </p>
                              </div>
                              <input
                                id="project-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={() => (
                      <FormItem>
                        <FormLabel>Technologies Used</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                          {form.getValues("technologies").map((tech, index) => (
                            <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                              {tech}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => removeTechnology(index)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add technology..."
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addTechnology()
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={addTechnology}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <FormLabel>Key Features</FormLabel>
                        <div className="space-y-2 mt-2 mb-3">
                          {form.getValues("features").map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-1 p-2 bg-muted/50 rounded-md">{feature}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFeature(index)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addFeature()
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={addFeature}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
              "Save Project"
            )}
          </Button>

          {project && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Project"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project from your portfolio.
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
