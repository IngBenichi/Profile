import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getPortfolioData } from "@/lib/data"
import TestimonialList from "@/components/admin/testimonial-list"

export default async function TestimonialsPage() {
  const data = await getPortfolioData()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Testimonial
          </Link>
        </Button>
      </div>
      <TestimonialList testimonials={data.testimonials} />
    </div>
  )
}
