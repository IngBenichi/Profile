"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Send, Loader2, CheckCircle } from "lucide-react"

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <Card className="border-border/40 shadow-md">
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            {/* Mensaje de éxito */}
            <h3 className="text-xl font-medium text-foreground mb-2">¡Mensaje enviado!</h3>
            <p className="text-muted-foreground mb-6">
              Gracias por contactarme. Te responderé lo antes posible.
            </p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Enviar otro mensaje
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/40 shadow-md">
      <CardHeader>
        <CardTitle>Enviar un Mensaje</CardTitle>
        <CardDescription>Completa el formulario y te responderé lo antes posible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" placeholder="Juan" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" placeholder="Pérez" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="juan@ejemplo.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input id="subject" placeholder="Consulta de Proyecto" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Cuéntame sobre tu proyecto u oportunidad laboral..." rows={5} required />
          </div>

          <Button type="submit" className="w-full gap-2 group" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
