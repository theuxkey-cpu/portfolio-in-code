"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/ui/tabs"
import { EducationTimeline } from "@/stories/foundations/education.story"
import { ExperienceTimeline } from "@/stories/foundations/experience.story"
import { SkillGroups } from "@/stories/foundations/skills.story"

const VIEWS = [
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education & Courses" },
  { value: "skills", label: "Skills & Tools" },
] as const

/** Experience, education and skills behind the same line tabs the cases use. */
export function AboutTabs() {
  return (
    <Tabs defaultValue="experience" className="gap-0">
      <div className="overflow-x-auto border-b border-border">
        <TabsList
          variant="line"
          aria-label="About sections"
          className="w-auto justify-start gap-1 p-0 group-data-[orientation=horizontal]/tabs:h-11 @2xl:group-data-[orientation=horizontal]/tabs:h-9"
        >
          {VIEWS.map((v) => (
            <TabsTrigger
              key={v.value}
              value={v.value}
              className="h-full flex-none px-3 text-[13px] group-data-[orientation=horizontal]/tabs:after:bottom-0"
            >
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="experience" className="pt-8">
        <ExperienceTimeline />
      </TabsContent>
      <TabsContent value="education" className="pt-8">
        <EducationTimeline />
      </TabsContent>
      <TabsContent value="skills" className="flex flex-col gap-6 pt-8">
        <SkillGroups level={2} />
      </TabsContent>
    </Tabs>
  )
}
