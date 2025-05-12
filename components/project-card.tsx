"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

interface ProjectCardProps {
  title: string
  role: string
  description: string
  technologies: string[]
  features: string[]
  githubUrl: string
  demoUrl: string
  imageUrl: string
}

const ProjectCard = ({
  title,
  role,
  description,
  technologies,
  features,
  githubUrl,
  demoUrl,
  imageUrl,
}: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="overflow-hidden border-border/40 shadow-md hover:shadow-lg transition-shadow min-w-[300px] md:min-w-[400px] max-w-[400px] flex flex-col">
      <div className="relative h-48 w-full group">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" asChild>
              <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo
              </Link>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <CardHeader>
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <p className="text-muted-foreground">{description}</p>

        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Technologies Used:</h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div>
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">Key Features:</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show More
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
