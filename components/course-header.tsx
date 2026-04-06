"use client"

import Link from "next/link"
import { Home, ChevronDown } from "lucide-react"
import type { Course } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CourseHeaderProps {
  course: Course
  activeTab: string
  unreadDiscussions?: number
  unreadGrades?: number
  unreadAnnouncements?: number
}

const tabs = [
  { id: "content", label: "Content" },
  { id: "calendar", label: "Calendar" },
  { id: "announcements", label: "Announcements", badgeKey: "unreadAnnouncements" },
  { id: "discussions", label: "Discussions", badgeKey: "unreadDiscussions" },
  { id: "gradebook", label: "Gradebook", badgeKey: "unreadGrades" },
  { id: "messages", label: "Messages" },
  { id: "groups", label: "Groups" },
]

export function CourseHeader({
  course,
  activeTab,
  unreadDiscussions = 0,
  unreadGrades = 0,
  unreadAnnouncements = 0,
}: CourseHeaderProps) {
  const badges: Record<string, number> = {
    unreadDiscussions,
    unreadGrades,
    unreadAnnouncements,
  }

  return (
    <div className="bg-zinc-900 text-white">
      <div className="flex items-center gap-4 px-4 py-2">
        <Link href="/" className="p-1 hover:bg-zinc-800 rounded">
          <Home className="h-5 w-5" />
        </Link>
        <button className="flex items-center gap-1 text-sm hover:bg-zinc-800 px-2 py-1 rounded">
          Courses <ChevronDown className="h-4 w-4" />
        </button>
        <span className="text-sm">{course.code}</span>
        <div className="ml-auto">
          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium">
            OPEN
          </span>
        </div>
      </div>

      <nav className="flex gap-1 px-4">
        {tabs.map((tab) => {
          const badgeCount = tab.badgeKey ? badges[tab.badgeKey] : 0
          return (
            <Link
              key={tab.id}
              href={`/courses/${course.id}?tab=${tab.id}`}
              className={cn(
                "relative px-3 py-2 text-sm transition-colors hover:bg-zinc-800",
                activeTab === tab.id
                  ? "border-b-2 border-purple-500 text-white"
                  : "text-zinc-400"
              )}
            >
              {tab.label}
              {badgeCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs">
                  {badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
