"use client";
import { Roboto_Slab } from "next/font/google";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Mail,
  Linkedin,
  Download,
  ChevronRight,
  MoveRight,
} from "lucide-react";
import ProjectCard from "@/components/project-card";
import ExperienceCard from "@/components/experience-card";
import TestimonialCard from "@/components/testimonial-card";
import ContactForm from "@/components/contact-form";
import ThemeToggle from "@/components/theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ViewAllProjectsButton from "@/components/view-all-projects-button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const DynamicGalaxyScene = dynamic(() => import("@/components/galaxy-canvas"), {
  ssr: false,
});

const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  return (
    <main className={`min-h-screen bg-background ${robotoSlab.className}`}>
      {/* Header with theme toggle */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-6xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-semibold text-xl">
            Camilo<span className="text-primary">Benitez</span>
          </Link>

          {/* Navegación (solo en pantallas medianas y grandes) */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "#about", label: "Sobre mí" },
              { href: "#skills", label: "Habilidades" },
              { href: "#projects", label: "Proyectos" },
              { href: "#experience", label: "Experiencia" },
              { href: "#education", label: "Educación" },
              { href: "#certificados", label: "Certificados" },
              { href: "#contact", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 group"
              >
                <span>{item.label}</span>
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Contenedor de acciones: Tema y botón de contacto */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              asChild
              className="bg-gradient-to-r from-primary via-fuchsia-500 to-blue-500 text-white font-semibold shadow-lg hover:from-primary/90 hover:to-blue-500/90 transition-all"
              size="sm"
            >
              <Link href="#contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contáctame
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative py-24 md:py-32 px-4 overflow-hidden bg-gradient-to-br from-background to-muted/50"
      >
        {/* Galaxia animada 3D usando Three.js */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              className="md:w-2/3"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                <span>Disponible para nuevas oportunidades</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-500 to-blue-500 drop-shadow-lg mb-2">
                Camilo Benitez
              </h1>
              <h2 className="mt-2 text-2xl md:text-3xl font-medium text-muted-foreground">
                Ingeniero de Software Backend
              </h2>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 group" asChild>
                  <Link
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={18} />
                    Descargar Hoja de Vida
                    <MoveRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="#contact">
                    Contáctame
                    <ChevronRight size={18} />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  href="https://github.com/IngBenichi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/benichidev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
            </motion.div>
            <motion.div
              className="md:w-1/3 flex justify-center"
              initial={{
                opacity: 0,
                scale: 0.8,
                filter: "blur(8px)",
                rotateY: 45,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                rotateY: 0,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ perspective: 1000 }}
            >
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <Image
                  src="/profile.png?height=256&width=256"
                  alt="Camilo Benitez"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </motion.section>

      {/* About Me Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">01</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Sobre mí</h2>
          </div>
          <div className="grid md:grid-cols-1 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Soy un{" "}
                <span className="font-semibold text-foreground">
                  Ingeniero De Software Backend
                </span>{" "}
                con una profunda pasión por la tecnología y la resolución de
                problemas complejos. Desde mis primeros pasos en la ingeniería
                de sistemas, he encontrado en el desarrollo backend el espacio
                ideal para combinar lógica, creatividad y eficiencia.
              </p>
              <p className="text-lg text-muted-foreground">
                Mi experiencia abarca{" "}
                <span className="font-semibold text-foreground">
                  Diseño De APIs Robustas
                </span>
                ,{" "}
                <span className="font-semibold text-foreground">
                  Arquitecturas De Microservicios
                </span>{" "}
                y la implementación de soluciones escalables en la nube.
                Disfruto optimizando el rendimiento de sistemas, asegurando la
                calidad del código y aplicando buenas prácticas de ingeniería
                para crear productos confiables y mantenibles.
              </p>
              <p className="text-lg text-muted-foreground">
                Me motiva el aprendizaje continuo y la colaboración. He
                participado en proyectos open-source, hackathons y equipos
                multidisciplinarios, donde he fortalecido habilidades técnicas y
                de comunicación. Mi enfoque está en aportar valor real,
                adaptándome rápidamente a nuevas tecnologías y retos.
              </p>
              <p className="text-lg text-muted-foreground">
                Actualmente, busco contribuir en proyectos que requieran{" "}
                <span className="font-semibold text-foreground">
                  Soluciones Backend Innovadoras
                </span>{" "}
                y donde pueda seguir creciendo profesionalmente. Si buscas a
                alguien comprometido, curioso y orientado a resultados,
                ¡conversemos!
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Technical Skills Section */}
      <motion.section
        id="skills"
        initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2 bg-muted/30"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">02</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Habilidades Técnicas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Dominio de tecnologías backend modernas, frameworks robustos,
              bases de datos relacionales y no relacionales, así como
              herramientas DevOps y metodologías ágiles. Mi enfoque está en la
              calidad, escalabilidad y seguridad del software.
            </p>
          </div>

          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full md:w-fit mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12 bg-transparent shadow-none">
              <TabsTrigger value="languages">Lenguajes</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="databases">Bases de datos</TabsTrigger>
              <TabsTrigger value="tools">DevOps y Herramientas</TabsTrigger>
            </TabsList>

            {/* Lenguajes */}
            <TabsContent value="languages" className="mt-6">
              <motion.div
                key="languages"
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
              >
                {/* Python */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/python-svgrepo-com.svg"
                      alt="Python"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">Python</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      5+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Javascript */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/javascript-svgrepo-com.svg"
                      alt="Javascript"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Javascript
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      3+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Typescript */}
                {/* <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/typescript-svgrepo-com.svg"
                      alt="Typescript"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Typescript
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card> */}
                {/* PHP */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/php-svgrepo-com.svg"
                      alt="PHP"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">PHP</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Frameworks */}
            <TabsContent value="frameworks" className="mt-6">
              <motion.div
                key="frameworks"
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
              >
                {/* Node.js */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/node-js-svgrepo-com.svg"
                      alt="Node.js"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Node.js
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      4+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Express */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/express-svgrepo-com.svg"
                      alt="Express"
                      className="w-10 h-10 mx-auto mb-2 rounded-full border-2 border-primary/60 bg-white p-1"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Express
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      4+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Django */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/django-icon-svgrepo-com.svg"
                      alt="Django"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">Django</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      3+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Flask */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/flask-svgrepo-com.svg"
                      alt="Flask"
                      className="w-10 h-10 mx-auto mb-2 rounded-full border-2 border-primary/60 bg-white p-1"
                    />
                    <p className="font-semibold text-base sm:text-lg">Flask</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>
                {/* FastAPI */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/fastapi-svgrepo-com.svg"
                      alt="FastAPI"
                      className="w-10 h-10 mx-auto mb-2 rounded-full border-2 border-primary/60 bg-white p-1"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      FastAPI
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Laravel */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/laravel-svgrepo-com.svg"
                      alt="Laravel"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Laravel
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Bases de datos */}
            <TabsContent value="databases" className="mt-6">
              <motion.div
                key="databases"
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
              >
                {/* PostgreSQL */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/postgresql-svgrepo-com.svg"
                      alt="PostgreSQL"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      PostgreSQL
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      3+ años
                    </div>
                  </CardContent>
                </Card>

                {/* MySQL */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/mysql-svgrepo-com.svg"
                      alt="MySQL"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">MySQL</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>

                {/* SQLite */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/sqlite-svgrepo-com.svg"
                      alt="SQLite"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">SQLite</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>

                {/* MongoDB */}
                {/* <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/mongodb-svgrepo-com.svg"
                      alt="MongoDB"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      MongoDB
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Básico
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      1 año
                    </div>
                  </CardContent>
                </Card> */}
              </motion.div>
            </TabsContent>

            {/* DevOps y Herramientas */}
            <TabsContent value="tools" className="mt-6">
              <motion.div
                key="tools"
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
              >
                {/* Docker */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/docker-svgrepo-com.svg"
                      alt="Docker"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">Docker</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      3+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Azure DevOps */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/azure-devops-svgrepo-com.svg"
                      alt="Azure DevOps"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">
                      Azure DevOps
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card>
                {/* AWS */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/aws-svgrepo-com.svg"
                      alt="AWS"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">AWS</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Básico
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      1 año
                    </div>
                  </CardContent>
                </Card>
                {/* Git */}
                <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/git-svgrepo-com.svg"
                      alt="Git"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">Git</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      5+ años
                    </div>
                  </CardContent>
                </Card>
                {/* Linux */}
                {/* <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/linux-svgrepo-com.svg"
                      alt="Linux"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">Linux</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Avanzado
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      4+ años
                    </div>
                  </CardContent>
                </Card> */}
                {/* CI/CD */}
                {/* <Card className="border-primary/40 shadow-md hover:shadow-xl transition-shadow group relative overflow-visible">
                  <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                    <img
                      src="/cicd-svgrepo-com.svg"
                      alt="CI/CD"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <p className="font-semibold text-base sm:text-lg">CI/CD</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      Intermedio
                    </span>
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      2+ años
                    </div>
                  </CardContent>
                </Card> */}
              </motion.div>
              <div className="mt-8 text-center text-muted-foreground text-sm">
                Experiencia en integración y despliegue continuo, automatización
                de pipelines, monitoreo y gestión de infraestructura en la nube.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* Proyectos Destacados con Carrusel */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 80, rotateY: 45 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">03</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Proyectos Destacados
            </h2>
          </div>
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{ slidesToScroll: 1, align: "start" }}
            >
              <CarouselContent>
                {/* Proyecto 1 */}
                <CarouselItem className="pl-2 pr-2 flex justify-center basis-full max-w-full">
                  <ProjectCard
                    title="Benichi's Blog"
                    role="Desarrollador Backend Líder"
                    description="Desarrollé una plataforma de blog personal enfocada en rendimiento y SEO, utilizando renderizado del lado del servidor y generación de sitios estáticos."
                    technologies={["Django", "PostgreSQL", "Azure", "Docker"]}
                    features={[
                      "Arquitectura de trabajadores escalable horizontalmente",
                      "Planificación de trabajos por prioridad",
                      "Panel de monitoreo en tiempo real",
                      "Mecanismos de recuperación ante fallos",
                    ]}
                    githubUrl="https://github.com/IngBenichi/My-Blog-App-Django"
                    demoUrl="https://blog.benichi.online"
                    imageUrl="/blog.png?height=300&width=600"
                  />
                </CarouselItem>
                {/* Proyecto 2 */}
                <CarouselItem className="pl-2 pr-2 flex justify-center basis-full max-w-full">
                  <ProjectCard
                    title="Restaurant-Order-System"
                    role="Ingeniero Backend"
                    description="Diseñé un sistema de gestión de pedidos para restaurantes con actualizaciones en tiempo real y una interfaz amigable para clientes y personal."
                    technologies={["Python"]}
                    features={["Seguimiento de pedidos en tiempo real"]}
                    githubUrl="https://github.com/IngBenichi/Restaurant-Order-System"
                    demoUrl="https://restaurant-order-system-9tn7.onrender.com/login"
                    imageUrl="/placeholder.svg?height=300&width=600"
                  />
                </CarouselItem>
                {/* Proyecto 3 */}
                <CarouselItem className="pl-2 pr-2 flex justify-center basis-full max-w-full">
                  <ProjectCard
                    title="EasyCurrency"
                    role="Desarrollador Backend"
                    description="Sistema de monitoreo de tasas de cambio con actualizaciones en tiempo real y análisis de datos históricos, usando arquitectura de microservicios."
                    technologies={["Python"]}
                    features={["Tasas de cambio en tiempo real"]}
                    githubUrl="https://github.com/IngBenichi/EasyCurrency"
                    demoUrl="https://easycurrency.onrender.com/rates"
                    imageUrl="/api.png?height=300&width=600"
                  />
                </CarouselItem>
                {/* Proyecto 4 */}
                <CarouselItem className="pl-2 pr-2 flex justify-center basis-full max-w-full">
                  <ProjectCard
                    title="E-COMMERCE-API"
                    role="Desarrollador Backend"
                    description="API RESTful para una plataforma de e-commerce, enfocada en escalabilidad y seguridad, con autenticación de usuarios y gestión de productos."
                    technologies={["Node.js", "Express"]}
                    features={["Autenticación y autorización de usuarios"]}
                    githubUrl="https://github.com/IngBenichi/E-COMMERCE-API"
                    demoUrl=""
                    imageUrl="/placeholder.svg?height=300&width=600"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </motion.section>

      {/* Work Experience Section */}
      <motion.section
        id="experience"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-8 px-2 sm:py-12 sm:px-2 bg-muted/30"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
              <span className="font-bold text-lg sm:text-xl">04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Experiencia Laboral
            </h2>
          </div>

          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-1 rounded-lg border border-border/30 bg-background/80 p-4 shadow-md flex flex-col justify-between">
              <ExperienceCard
                company="Domotes S.A.S"
                position="Backend Developer Junior"
                period="Dec 2024 - Present"
                location="Barranquilla, Atlántico, Colombia · On-site"
                description="En mi rol, desarrollo y mantengo sistemas backend escalables utilizando Laravel y microservicios basados en Python. Me enfoco en escribir código limpio y eficiente, siguiendo las mejores prácticas de desarrollo de software y patrones arquitectónicos para asegurar la mantenibilidad y el rendimiento."
                achievements={[
                  "Desarrollé y mantuve sistemas backend escalables usando Laravel y microservicios en Python",
                  "Construí y gestioné pipelines de CI/CD aprovechando Microsoft Azure",
                  "Trabajé con contenedores Docker para crear entornos consistentes y optimizar los despliegues",
                  "Administré y optimicé bases de datos, asegurando alto rendimiento y confiabilidad",
                  "Diseñé e implementé APIs RESTful, siguiendo las mejores prácticas",
                  "Contribuí a mantener una arquitectura de sistema robusta, escalable y de alta calidad",
                ]}
              />
            </div>
            <div className="flex-1 rounded-lg border border-border/30 bg-background/80 p-4 shadow-md flex flex-col justify-between">
              <ExperienceCard
                company="ARC4M"
                position="Co-Founder & Software Engineer"
                period="Jan 2024 - Present"
                location="Barranquilla, Atlántico, Colombia · Remoto"
                description="Como cofundador y software engineer en ARC4M, lidero el desarrollo de soluciones tecnológicas innovadoras, participando en la toma de decisiones estratégicas y en la implementación de arquitecturas robustas para nuestros productos y servicios."
                achievements={[
                  "Co-fundé la empresa y participé en la definición de la visión tecnológica",
                  "Diseñé e implementé arquitecturas escalables para productos SaaS",
                  "Lideré equipos de desarrollo en proyectos de software a medida",
                  "Implementé prácticas de DevOps y despliegue continuo",
                  "Colaboré con clientes para entender y resolver necesidades técnicas complejas",
                ]}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Education Section */}
      <motion.section
        id="education"
        initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">05</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Educación</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Formación académica sólida en ingeniería de sistemas,
              complementada con proyectos prácticos, participación en
              actividades extracurriculares y un enfoque constante en el
              aprendizaje de nuevas tecnologías.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border-border/40 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                {/* <div className="flex-shrink-0">
                  <Image
                    src="/cuc-logo.png"
                    alt="Universidad de la Costa CUC"
                    width={56}
                    height={56}
                    className="rounded-full border border-border bg-white"
                  />
                </div> */}
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    Ingeniería en Sistemas
                  </CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span>Universidad de la Costa CUC</span>
                    <span className="hidden sm:inline mx-2">•</span>
                    <span>Feb 2023 - Dic 2027 (En curso)</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Actualmente cursando la carrera de Ingeniería en Sistemas, con
                  énfasis en desarrollo de software, arquitectura de sistemas y
                  tecnologías backend. He participado en proyectos
                  colaborativos, hackathons universitarios y actividades de
                  investigación.
                </p>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Cursos relevantes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Fundamentos de Programación",
                      "Gestión de Bases de Datos",
                      "Ingeniería de Software",
                      "Redes de Computadoras",
                      "Desarrollo Web",
                      "Arquitectura de Computadores",
                      "Sistemas Distribuidos",
                      "Seguridad Informática",
                    ].map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Logros y actividades:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      Participación en hackathons y competencias de programación
                      universitaria
                    </li>
                    <li>
                      Miembro activo del semillero de investigación en
                      tecnologías backend
                    </li>
                    <li>
                      Desarrollo de proyectos académicos enfocados en APIs y
                      microservicios
                    </li>
                    <li>
                      Colaboración en iniciativas de software libre y mentoría a
                      estudiantes de semestres inferiores
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Certificados Section */}
      <motion.section
        id="certificados"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2 bg-muted/30"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">06</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Certificados
              <span className="text-base font-normal text-muted-foreground">
                (10)
              </span>
            </h2>
          </div>

          <div className="relative"></div>
          <Carousel
            className="w-full"
            opts={{ slidesToScroll: 1, align: "start" }}
          >
            <CarouselContent>
              {/* Certificado 1 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/django.png"
                          alt="Certificado Django"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Django
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/django.png"
                        alt="Certificado Django"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">Django</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 2 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/devops.png"
                          alt="Certificado DevOps"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        DevOps
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/devops.png"
                        alt="Certificado DevOps"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">DevOps</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 3 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/django_rest.png"
                          alt="Certificado Django REST"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Django REST
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/django_rest.png"
                        alt="Certificado Django REST"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      Django REST
                    </h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 4 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/docker.png"
                          alt="Certificado Docker"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Docker
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/docker.png"
                        alt="Certificado Docker"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">Docker</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 5 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/fastapi.png"
                          alt="Certificado FastAPI"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        FastAPI
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/fastapi.png"
                        alt="Certificado FastAPI"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">FastAPI</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 6 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/ia.png"
                          alt="Certificado Inteligencia Artificial"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Inteligencia Artificial
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/ia.png"
                        alt="Certificado Inteligencia Artificial"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      Inteligencia Artificial
                    </h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 7 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/laravel_rest.png"
                          alt="Certificado Laravel REST"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Laravel REST
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/laravel_rest.png"
                        alt="Certificado Laravel REST"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      Laravel REST
                    </h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 8 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/laravel.png"
                          alt="Certificado Laravel"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        Laravel
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/laravel.png"
                        alt="Certificado Laravel"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">Laravel</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 9 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/oauth.png"
                          alt="Certificado OAuth"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        OAuth
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/oauth.png"
                        alt="Certificado OAuth"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">OAuth</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
              {/* Certificado 10 */}
              <CarouselItem
                className="pl-2 pr-2 flex justify-center 
  basis-full max-w-full 
  sm:basis-1/2 sm:max-w-1/2 
  md:basis-1/3 md:max-w-1/3 
  lg:basis-1/4 lg:max-w-1/4
            "
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center bg-background rounded-lg shadow p-6 min-w-[300px] max-w-xs cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-48 relative mb-4">
                        <Image
                          src="/owasp.png"
                          alt="Certificado OWASP"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        OWASP
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-4xl w-full bg-background">
                    <div className="w-full flex justify-center">
                      <Image
                        src="/owasp.png"
                        alt="Certificado OWASP"
                        width={900}
                        height={600}
                        className="object-contain rounded mb-4 max-h-[70vh] w-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">OWASP</h3>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-10 px-2"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <span className="font-bold text-xl">07</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Contacto</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Información de contacto
              </h3>
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
                    href="https://www.linkedin.com/in/benichidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    linkedin.com/in/benichidev
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
                <h3 className="text-xl font-semibold mb-6">
                  ¿Buscas un desarrollador backend?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Actualmente estoy abierto a nuevas oportunidades donde pueda
                  aportar mi experiencia construyendo sistemas backend
                  escalables y APIs. Si necesitas ayuda en un proyecto
                  específico o buscas sumar un especialista backend a tu equipo,
                  ¡hablemos!
                </p>
                <p className="text-muted-foreground">
                  No dudes en contactarme a través del formulario o cualquiera
                  de los canales anteriores.
                </p>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Optional Blog Section Teaser */}

      {/* Footer */}
      <footer className="py-4 px-2 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} Camilo Benitez. Todos los derechos
                reservados.
              </p>
            </div>
            <div className="flex gap-4"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
