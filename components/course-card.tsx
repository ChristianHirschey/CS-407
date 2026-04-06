"use client"

import Link from "next/link"
import { Star, ChevronDown } from "lucide-react"
import type { Course, Assignment } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const { toggleFavorite, getUpcomingAssignmentForCourse } = useData()

  const upcomingAssignment = getUpcomingAssignmentForCourse(course.id)

  return (
    <div className="flex items-stretch border-b border-zinc-200">
      <div className="w-1" style={{ backgroundColor: course.color }} />
      <div className="flex flex-1 items-center justify-between px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {course.term.slice(0, 5)}.{course.term}
          </span>
          <Link
            href={`/courses/${course.id}`}
            className="font-medium text-foreground hover:underline"
          >
            {course.code}
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-zinc-900">Open</span>
            <span>|</span>
            <span className="text-purple-600 hover:underline cursor-pointer">
              {course.instructor}
            </span>
            <span>|</span>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              More info <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          {upcomingAssignment && (
            <Link
              href={`/courses/${course.id}/assignments/${upcomingAssignment.id}`}
              className="mt-1 text-sm text-orange-600 font-medium hover:underline"
            >
              {upcomingAssignment.title} Due Soon!
            </Link>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(course.id)}
          className={cn(
            "p-2 transition-colors",
            course.isFavorite
              ? "text-purple-500 hover:text-purple-600"
              : "text-zinc-300 hover:text-zinc-400"
          )}
        >
          <Star
            className="h-5 w-5"
            fill={course.isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  )
}
