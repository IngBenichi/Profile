import { getPortfolioData } from "@/lib/data"
import { notFound } from "next/navigation"
import TestimonialForm from "@/components/admin/testimonial-form"

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const data = await getPortfolioData()

  // Handle "new" testimonial case
  if (params.id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Add New Testimonial</h1>
        <TestimonialForm />
      </div>
    )
  }

  // Find existing testimonial
  const testimonialId = Number.parseInt(params.id)
  const testimonial = data.testimonials.find((t) => t.id === testimonialId)

  if (!testimonial) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Testimonial</h1>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
