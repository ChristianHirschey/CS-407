"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { X, Calendar, FileText, RotateCcw } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"

interface AssignmentPageProps {
  params: Promise<{ courseId: string; assignmentId: string }>
}

export default function AssignmentPage({ params }: AssignmentPageProps) {
  const { courseId, assignmentId } = use(params)

  const { getCourse, getAssignment } = useData()

  const course = getCourse(courseId)
  const assignment = getAssignment(assignmentId)

  if (!course || !assignment) {
    notFound()
  }

  const getTimeRemaining = () => {
    return "12 hours from now"
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="w-12 bg-purple-600 flex flex-col items-center py-4 gap-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-white hover:bg-purple-700 p-2 rounded"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="text-sm text-muted-foreground">{course.code}</div>
          <h1 className="text-2xl font-medium">{assignment.title}</h1>
        </header>

        <div className="flex">
          <main className="flex-1 p-6">
            <div className="rounded-lg border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-6 py-4">
                <h2 className="font-medium">Details</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Assessment due date:</div>
                    <div className="text-muted-foreground">
                      {assignment.dueDate} ({getTimeRemaining()})
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Assessment Details</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {assignment.description}
                  </div>
                </div>

                {assignment.type === "group" && assignment.groupMembers && (
                  <div>
                    <h3 className="font-medium mb-3">
                      Group Members ({assignment.groupMembers.length})
                    </h3>
                    <div className="space-y-2">
                      {assignment.groupMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside className="w-72 shrink-0 border-l border-zinc-200 bg-white p-6">
            <h2 className="font-medium">Grades/Attempts</h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Maximum points</span>
                <span className="ml-auto font-medium">
                  {assignment.maxPoints} points
                </span>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Attempts:</span>
                <span className="ml-auto font-medium">{assignment.attempts}</span>
              </div>

              <Button className="w-full mt-4">Start Attempt 1</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
