import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  position: string
}

const TestimonialCard = ({ quote, author, position }: TestimonialCardProps) => {
  return (
    <Card className="border-border/40 shadow-md hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <Quote className="h-8 w-8 text-primary/20 mb-4" />
        <p className="text-muted-foreground italic mb-6 flex-grow">{quote}</p>
        <div className="pt-4 border-t border-border/40">
          <p className="font-medium text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
