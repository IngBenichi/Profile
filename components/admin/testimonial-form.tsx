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
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/app/actions/portfolio-actions"
import type { TestimonialData } from "@/lib/types"
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

const testimonialFormSchema = z.object({
  quote: z.string().min(10, { message: "Quote must be at least 10 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

export default function TestimonialForm({ testimonial }: { testimonial?: TestimonialData }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: testimonial
      ? {
          ...testimonial,
        }
      : {
          quote: "",
          author: "",
          position: "",
        },
  })

  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true)
    try {
      if (testimonial) {
        await updateTestimonial({ ...data, id: testimonial.id })
        toast({
          title: "Testimonial updated",
          description: "Your testimonial has been updated successfully.",
        })
      } else {
        await createTestimonial(data)
        toast({
          title: "Testimonial created",
          description: "Your new testimonial has been created successfully.",
        })
        router.push("/admin/testimonials")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your testimonial.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!testimonial) return

    setIsDeleting(true)
    try {
      await deleteTestimonial(testimonial.id)
      toast({
        title: "Testimonial deleted",
        description: "Your testimonial has been deleted successfully.",
      })
      router.push("/admin/testimonials")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your testimonial.",
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
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Quote</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="John is an exceptional backend engineer who consistently delivers robust and scalable solutions..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The testimonial text from the person.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sarah Johnson" {...field} />
                      </FormControl>
                      <FormDescription>The name of the person giving the testimonial.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Position</FormLabel>
                      <FormControl>
                        <Input placeholder="CTO at TechCorp Solutions" {...field} />
                      </FormControl>
                      <FormDescription>The position or role of the person.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              "Save Testimonial"
            )}
          </Button>

          {testimonial && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Testimonial"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this testimonial from your portfolio.
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
