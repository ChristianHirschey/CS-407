"use client"

import { use } from "react"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { CourseHeader } from "@/components/course-header"
import { CourseContentTab } from "@/components/course-content-tab"
import { CourseCalendarTab } from "@/components/course-calendar-tab"
import { CourseAnnouncementsTab } from "@/components/course-announcements-tab"
import { CourseDiscussionsTab } from "@/components/course-discussions-tab"
import { useData } from "@/lib/data-context"

interface CoursePageProps {
  params: Promise<{ courseId: string }>
}

export default function CoursePage({ params }: CoursePageProps) {
  const { courseId } = use(params)
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "content"

  const {
    getCourse,
    getContentForCourse,
    getAnnouncementsForCourse,
    getDiscussionsForCourse,
    getEventsForCourse,
    markAnnouncementRead,
    markAllAnnouncementsReadForCourse,
  } = useData()

  const course = getCourse(courseId)

  if (!course) {
    notFound()
  }

  const contentItems = getContentForCourse(courseId)
  const announcements = getAnnouncementsForCourse(courseId)
  const discussions = getDiscussionsForCourse(courseId)
  const events = getEventsForCourse(courseId)
  const unreadDiscussions = discussions.filter((d) => !d.isCompleted).length
  const unreadAnnouncements = announcements.filter((a) => !a.isRead).length

  const renderTabContent = () => {
    switch (tab) {
      case "content":
        return <CourseContentTab course={course} contentItems={contentItems} />
      case "calendar":
        return <CourseCalendarTab events={events} courseName={course.name} />
      case "announcements":
        return (
          <CourseAnnouncementsTab
            announcements={announcements}
            onMarkRead={markAnnouncementRead}
            onMarkAllRead={() => markAllAnnouncementsReadForCourse(courseId)}
          />
        )
      case "discussions":
        return <CourseDiscussionsTab courseId={courseId} />
      case "gradebook":
        return (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Gradebook coming soon
          </div>
        )
      case "messages":
        return (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Messages coming soon
          </div>
        )
      case "groups":
        return (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Groups coming soon
          </div>
        )
      default:
        return <CourseContentTab course={course} contentItems={contentItems} />
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <CourseHeader
        course={course}
        activeTab={tab}
        unreadDiscussions={unreadDiscussions}
        unreadAnnouncements={unreadAnnouncements}
      />
      <main className="p-6">{renderTabContent()}</main>
    </div>
  )
}
