import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Linkedin, Download, ChevronRight, MoveRight } from "lucide-react"
import ProjectCard from "@/components/project-card"
import ExperienceCard from "@/components/experience-card"
import TestimonialCard from "@/components/testimonial-card"
import ContactForm from "@/components/contact-form"
import ThemeToggle from "@/components/theme-toggle"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import ViewAllProjectsButton from "@/components/view-all-projects-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-6xl items-center justify-between">
          <Link href="/" className="font-semibold text-xl">
            Camilo<span className="text-primary">Benitez</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="#skills"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#projects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#experience"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Experience
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-2/3">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                <span>Available for new opportunities</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">Camilo Benitez</h1>
              <h2 className="mt-2 text-2xl md:text-3xl font-medium text-muted-foreground">Backend Software Engineer</h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
                Building robust, scalable backend systems and APIs that power modern applications. Specializing in
                distributed systems, microservices architecture, and cloud infrastructure.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 group" asChild>
                  <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download size={18} />
                    Download Resume
                    <MoveRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="#contact">
                    Contact Me
                    <ChevronRight size={18} />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="https://github.com/IngBenichi" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/camilo-ben%C3%ADtez-benichi-aa6557314/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="mailto:djangobenichi@gmail.com">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <Image
                  src="/profile.png?height=256&width=256"
                  alt="Camilo Benitez"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">01</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">About Me</h2>
          </div>
          <div className="grid md:grid-cols-1 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                I'm a passionate Backend Software Engineer with over 7 years of experience designing and implementing
                scalable, high-performance systems. My journey in software development began during my computer science
                studies, where I discovered my passion for solving complex problems through elegant backend solutions.
              </p>
              <p className="text-lg text-muted-foreground">
                Throughout my career, I've specialized in building robust APIs, microservices architectures, and
                data-intensive applications. I'm particularly interested in system design, performance optimization, and
                cloud-native development.
              </p>
              <p className="text-lg text-muted-foreground">
                When I'm not coding, you can find me contributing to open-source projects, mentoring junior developers,
                or exploring the latest advancements in backend technologies and distributed systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">02</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Technical Skills</h2>
          </div>

          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full md:w-fit mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="databases">Databases</TabsTrigger>
              <TabsTrigger value="tools">DevOps & Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="languages" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {["Python", "Javascript","PHP","SQL"].map((skill) => (
                  <Card key={skill} className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <p className="font-medium text-lg">{skill}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {["Node.js", "Express", "Django", "Flask", "FastAPI", "Laravel"].map(
                  (skill) => (
                    <Card key={skill} className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <p className="font-medium text-lg">{skill}</p>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="databases" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {["PostgreSQL", "MySQL", "SQLite"].map(
                  (skill) => (
                    <Card key={skill} className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <p className="font-medium text-lg">{skill}</p>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {["Docker","Azure", "CI/CD", "Git", "Terraform", "Prometheus"].map((skill) => (
                  <Card key={skill} className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <p className="font-medium text-lg">{skill}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">03</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
          </div>

          <ScrollArea className="w-full pb-6 overflow-x-auto">
            <div className="flex flex-wrap gap-6 justify-center">
              <ProjectCard
                title="Benichi's Blog"
                role="Lead Backend Developer"
                description="Developed a personal blog platform with a focus on performance and SEO, utilizing server-side rendering and static site generation."
                technologies={["Django", "PostgreSQL", "Azure", "Docker"]}
                features={[
                  "Horizontally scalable worker architecture",
                  "Priority-based job scheduling",
                  "Real-time monitoring dashboard",
                  "Failure recovery mechanisms",
                ]}
                githubUrl="https://github.com/IngBenichi/My-Blog-App-Django"
                demoUrl="https://blog.benichi.online"
                imageUrl="/blog.png?height=300&width=600"
              />

              <ProjectCard
                title="Restaurant-Order-System"
                role="Backend Engineer"
                description="Designed a restaurant order management system with real-time updates and a user-friendly interface for both customers and staff."
                technologies={["python"]}
                features={[
                  "Real-time order tracking",
                ]}
                githubUrl="https://github.com/IngBenichi/Restaurant-Order-System"
                demoUrl="https://restaurant-order-system-9tn7.onrender.com/login"
                imageUrl="/placeholder.svg?height=300&width=600"
              />

              <ProjectCard
                title="EasyCurrency"
                role="Backend Developer"
                description="Built a currency exchange rate monitoring system with real-time updates and historical data analysis, using a microservices architecture."
                technologies={["Python"]}
                features={[
                  "Real-time currency exchange rates",
                ]}
                githubUrl="https://github.com/IngBenichi/EasyCurrency"
                demoUrl="https://easycurrency.onrender.com/rates"
                imageUrl="/api.png?height=300&width=600"
              />

              <ProjectCard
                title="E-COMMERCE-API"
                role="Backend Developer"
                description="Developed a RESTful API for an e-commerce platform, focusing on scalability and security, with features like user authentication and product management."
                technologies={["Node.js", "Express"]}
                features={[
                  "User authentication and authorization",
                ]}
                githubUrl="https://github.com/IngBenichi/E-COMMERCE-API"
                demoUrl=""
                imageUrl="/placeholder.svg?height=300&width=600"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">04</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Work Experience</h2>
          </div>

            <div className="space-y-8">
            <ExperienceCard
              company="Domotes S.A.S"
              position="Backend Developer Junior"
              period="Dec 2024 - Present"
              location="Barranquilla, Atlántico, Colombia · On-site"
              description="In my role, I develop and maintain scalable backend systems using Laravel and Python-based microservices. I focus on writing clean and efficient code, following software development best practices and architectural patterns to ensure maintainability and performance."
              achievements={[
              "Developed and maintained scalable backend systems using Laravel and Python-based microservices",
              "Built and managed CI/CD pipelines leveraging Microsoft Azure",
              "Worked with Docker containers to create consistent environments and streamline deployments",
              "Managed and optimized databases, ensuring high performance and reliability",
              "Designed and implemented RESTful APIs, adhering to best practices",
              "Contributed to maintaining a robust, scalable, and high-quality system architecture",
              ]}
            />
            </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">05</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Education</h2>
          </div>

          <div className="max-w-3xl mx-auto">

            <Card className="border-border/40">
              <CardHeader>
              <CardTitle>Engineering in Systems</CardTitle>
              <CardDescription>Universidad de la Costa CUC, Feb 2023 - Dec 2027</CardDescription>
              </CardHeader>
              <CardContent>
              <p className="text-muted-foreground">
                Currently pursuing a degree in Systems Engineering with a focus on software development and system design.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Relevant Coursework:</h4>
                <div className="flex flex-wrap gap-2">
                {[
                  "Programming Fundamentals",
                  "Database Management",
                  "Software Engineering",
                  "Computer Networks",
                  "Web Development",
                ].map((course) => (
                  <Badge key={course} variant="secondary">
                  {course}
                  </Badge>
                ))}
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">06</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Testimonials</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Camilo is an exceptional backend engineer who consistently delivers robust and scalable solutions. His deep understanding of distributed systems has been invaluable to our team."
              author="Sarah Johnson"
              position="CTO at TechCorp Solutions"
            />

            <TestimonialCard
              quote="Working with Camilo was a game-changer for our project. His expertise in API design and database optimization transformed our platform's performance."
              author="Michael Chen"
              position="Product Manager at DataFlow Systems"
            />

            <TestimonialCard
              quote="Camilo technical skills are matched only by his ability to explain complex concepts clearly. He's not just a developer but a true problem solver."
              author="Emily Rodriguez"
              position="Engineering Director at CloudScale"
            />

            <TestimonialCard
              quote="I've worked with many backend developers, but Camilo stands out for his attention to detail and commitment to writing clean, maintainable code."
              author="David Kim"
              position="Lead Developer at InnovateTech"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">07</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Get In Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href="mailto:djangobenichi@gmail.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    djangobenichi@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Linkedin className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href="https://www.linkedin.com/in/camilo-ben%C3%ADtez-benichi-aa6557314/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    linkedin.com/in/camilo-benitez
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href="https://github.com/IngBenichi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    github.com/IngBenichi
                  </a>
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h3 className="text-xl font-semibold mb-6">Looking for a backend developer?</h3>
                <p className="text-muted-foreground mb-6">
                  I'm currently open to new opportunities where I can leverage my expertise in building scalable backend
                  systems and APIs. Whether you need help with a specific project or are looking to add a backend
                  specialist to your team, I'd love to discuss how I can contribute.
                </p>
                <p className="text-muted-foreground">
                  Feel free to reach out through the contact form or any of the channels listed above.
                </p>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Optional Blog Section Teaser */}

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">© {new Date().getFullYear()} Camilo Benitez. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
