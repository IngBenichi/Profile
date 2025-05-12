import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ExperienceCardProps {
  company: string;
  position: string;
  period: string;
  location: string; // Added the missing 'location' property
  description: string;
  achievements: string[];
}

const ExperienceCard = ({ company, position, period, description, achievements }: ExperienceCardProps) => {
  return (
    <Card className="border-border/40 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-xl">{position}</CardTitle>
            <CardDescription className="text-lg font-medium text-primary">{company}</CardDescription>
          </div>
          <CardDescription className="text-muted-foreground font-medium px-3 py-1 bg-muted rounded-full text-sm">
            {period}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>

        <div>
          <h4 className="font-medium mb-3 text-foreground">Key Achievements:</h4>
          <ul className="space-y-2">
            {achievements.map((achievement, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceCard
