"use client"

import Link from "next/link"
import {
  MessageSquare,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Folder,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import type { Discussion } from "@/lib/types"

interface CourseDiscussionsTabProps {
  courseId: string
  discussions: Discussion[]
}

export function CourseDiscussionsTab({
  courseId,
  discussions,
}: CourseDiscussionsTabProps) {
  const {
    getPostsForDiscussion,
    markAllPostsReadForDiscussion,
    markAllDiscussionsReadForCourse,
  } = useData()

  const unreadCount = discussions.filter((discussion) => !discussion.isCompleted).length
  const totalCount = discussions.length
  const hasUnreadPosts = discussions.some((discussion) =>
    getPostsForDiscussion(discussion.id).some((post) => post.isNew)
  )

  const handleMarkAllRead = () => {
    markAllDiscussionsReadForCourse(courseId)
    discussions.forEach((discussion) => {
      markAllPostsReadForDiscussion(discussion.id)
    })
  }

  return (
    <div className="mx-auto max-w-4xl py-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {unreadCount} unread ({totalCount} total)
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 && !hasUnreadPosts}
        >
          Mark all as Read
        </Button>
      </div>
      {discussions.map((discussion) => (
        <Link
          key={discussion.id}
          href={`/courses/${courseId}/discussions/${discussion.id}`}
          className="block rounded-lg border border-zinc-200 bg-white p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {discussion.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-zinc-300" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">{discussion.title}</h3>
              {discussion.grade && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {discussion.grade.score}/{discussion.grade.total}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {!discussion.isCompleted && (
                <Circle className="h-2 w-2 fill-purple-500 text-purple-500" />
              )}
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 ml-8">
            <p className="text-sm text-muted-foreground">
              Due date:{" "}
              <span className="text-purple-600">{discussion.dueDate}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {discussion.description}
            </p>
          </div>
        </Link>
      ))}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Folder className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Folder</h3>
            <p className="text-sm text-muted-foreground">
              Select the title to access the discussion.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
