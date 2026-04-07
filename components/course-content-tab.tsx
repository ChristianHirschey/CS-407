"use client"

import Link from "next/link"
import {
  Search,
  Link as LinkIcon,
  FileText,
  Folder,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Mail,
  ClipboardList,
} from "lucide-react"
import type { Course, ContentItem } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CourseContentTabProps {
  course: Course
  contentItems: ContentItem[]
}

export function CourseContentTab({ course, contentItems }: CourseContentTabProps) {
  const { getAssignmentsForCourse } = useData()
  const assignments = getAssignmentsForCourse(course.id)

  const now = new Date()
  const dueSoon = assignments.filter((a) => {
    const diff = new Date(a.dueDateISO).getTime() - now.getTime()
    return diff > 0 && diff <= 48 * 60 * 60 * 1000
  })
  const due24 = dueSoon.filter(
    (a) => new Date(a.dueDateISO).getTime() - now.getTime() <= 24 * 60 * 60 * 1000
  )
  const due48 = dueSoon.filter(
    (a) => new Date(a.dueDateISO).getTime() - now.getTime() > 24 * 60 * 60 * 1000
  )

  const getIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "link":
        return <LinkIcon className="h-4 w-4 text-muted-foreground" />
      case "document":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "folder":
        return <Folder className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div
          className="h-32 w-full rounded-t-lg"
          style={{
            background: `linear-gradient(135deg, ${course.color}40 0%, ${course.color}20 100%)`,
          }}
        />
        <div className="px-4 py-3 text-lg font-medium">{course.code}</div>

        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <h2 className="font-medium">Course Content</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search" className="w-48 pl-9" />
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {contentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50"
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  {item.type === "folder" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-zinc-300" />
                  )}
                </div>
                {getIcon(item.type)}
                <span className="flex-1">{item.title}</span>
                {item.hasAlert && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                {item.type === "folder" && (
                  <>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-72 shrink-0">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="mb-3 font-medium">Course Faculty</h3>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {course.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{course.instructor}</div>
              <div className="text-xs text-muted-foreground uppercase">
                {course.instructorRole}
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="mb-3 font-medium">Details &amp; Actions</h3>
          <div className="space-y-3">
            <Link
              href={`/courses/${course.id}/roster`}
              className="flex items-center gap-2 text-sm"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div>Roster</div>
                <div className="text-xs text-purple-600 hover:underline">
                  View everyone in your course
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <div>
                <div>Attendance</div>
                <div className="text-xs text-purple-600 hover:underline">
                  View your attendance
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <div>Books &amp; Tools</div>
                <div className="text-xs text-purple-600 hover:underline">
                  View course &amp; institution tools
                </div>
              </div>
            </div>
          </div>
        </div>

        {dueSoon.length > 0 && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
            <h3 className="mb-3 font-medium">Due Soon</h3>
            <div className="space-y-3">
              {due24.length > 0 && (
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    24 hours
                  </div>
                  <div className="space-y-2">
                    {due24.map((assignment) => (
                      <Link
                        key={assignment.id}
                        href={`/courses/${course.id}/assignments/${assignment.id}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="font-medium text-foreground hover:underline">
                          {assignment.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {due48.length > 0 && (
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    48 hours
                  </div>
                  <div className="space-y-2">
                    {due48.map((assignment) => (
                      <Link
                        key={assignment.id}
                        href={`/courses/${course.id}/assignments/${assignment.id}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="font-medium text-foreground hover:underline">
                          {assignment.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="mb-3 font-medium">Course Schedule</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div>{course.code.split("-")[1]}</div>
                <div className="text-purple-600">{course.schedule.days}</div>
                <div className="text-muted-foreground">
                  {course.schedule.time}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div>Location</div>
                <div className="text-muted-foreground">
                  {course.schedule.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}