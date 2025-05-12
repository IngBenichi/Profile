"use client"

import type { TestimonialData } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Quote } from "lucide-react"
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
import { deleteTestimonial } from "@/app/actions/portfolio-actions"
import { useRouter } from "next/navigation"

export default function TestimonialList({ testimonials }: { testimonials: TestimonialData[] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteTestimonial(id)
      toast({
        title: "Testimonial deleted",
        description: "Your testimonial has been deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your testimonial.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-4">No testimonials found</h3>
        <Button asChild>
          <Link href="/admin/testimonials/new">Add Your First Testimonial</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full">
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground italic mb-6 flex-grow">{testimonial.quote}</p>
              <div className="pt-4 border-t border-border/40">
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.position}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/testimonials/${testimonial.id}`}>
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
                    This action cannot be undone. This will permanently delete this testimonial from your portfolio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(testimonial.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {deletingId === testimonial.id ? "Deleting..." : "Delete"}
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
