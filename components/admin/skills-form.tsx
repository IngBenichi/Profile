"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateSkills } from "@/app/actions/portfolio-actions"
import type { SkillsData } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const skillsFormSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  tools: z.array(z.string()),
})

type SkillsFormValues = z.infer<typeof skillsFormSchema>

export default function SkillsForm({ skills }: { skills: SkillsData }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("languages")
  const [newSkill, setNewSkill] = useState("")

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      languages: skills.languages || [],
      frameworks: skills.frameworks || [],
      databases: skills.databases || [],
      tools: skills.tools || [],
    },
  })

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      const currentSkills = form.getValues(activeTab as keyof SkillsFormValues)
      form.setValue(activeTab as keyof SkillsFormValues, [...currentSkills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (category: keyof SkillsFormValues, index: number) => {
    const currentSkills = form.getValues(category)
    form.setValue(
      category,
      currentSkills.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: SkillsFormValues) => {
    setIsSubmitting(true)
    try {
      await updateSkills(data)
      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your skills.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="languages" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="languages">Languages</TabsTrigger>
                <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
                <TabsTrigger value="databases">Databases</TabsTrigger>
                <TabsTrigger value="tools">DevOps & Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="languages">
                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <FormLabel>Programming Languages</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {form.getValues("languages").map((skill, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeSkill("languages", index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add language..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>Add programming languages you are proficient in.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="frameworks">
                <FormField
                  control={form.control}
                  name="frameworks"
                  render={() => (
                    <FormItem>
                      <FormLabel>Frameworks & Libraries</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {form.getValues("frameworks").map((skill, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeSkill("frameworks", index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add framework..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>Add frameworks and libraries you work with.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="databases">
                <FormField
                  control={form.control}
                  name="databases"
                  render={() => (
                    <FormItem>
                      <FormLabel>Databases</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {form.getValues("databases").map((skill, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeSkill("databases", index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add database..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>Add database technologies you are familiar with.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="tools">
                <FormField
                  control={form.control}
                  name="tools"
                  render={() => (
                    <FormItem>
                      <FormLabel>DevOps & Tools</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {form.getValues("tools").map((skill, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeSkill("tools", index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tool..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>Add DevOps tools and other technologies you use.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Skills"
          )}
        </Button>
      </form>
    </Form>
  )
}
