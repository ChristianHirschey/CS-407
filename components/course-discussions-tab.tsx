"use client"

import Link from "next/link"
import {
  MessageSquare,
  CheckCircle2,
  Circle,
  Star,
  Bell,
  BellOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import type { Discussion } from "@/lib/types"
import { cn } from "@/lib/utils"

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
    toggleDiscussionFavorite,
    toggleDiscussionMute,
  } = useData()

  const unreadCount = discussions.filter(
    (discussion) => !discussion.isCompleted && !discussion.isMuted
  ).length
  const totalCount = discussions.length
  const sortedDiscussions = [...discussions].sort(
    (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
  )
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
      {sortedDiscussions.map((discussion) => (
        <Link
          key={discussion.id}
          href={`/courses/${courseId}/discussions/${discussion.id}`}
          className={cn(
            "block rounded-lg border border-zinc-200 p-4 transition-shadow hover:shadow-sm",
            discussion.isMuted
              ? "bg-zinc-50 text-muted-foreground"
              : "bg-white"
          )}
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
              <MessageSquare
                className={cn(
                  "h-5 w-5",
                  discussion.isMuted ? "text-zinc-400" : "text-muted-foreground"
                )}
              />
              <h3 className="font-medium">{discussion.title}</h3>
              {discussion.grade && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {discussion.grade.score}/{discussion.grade.total}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {!discussion.isCompleted && (
                <Circle
                  className={cn(
                    "h-2 w-2",
                    discussion.isMuted
                      ? "fill-zinc-400 text-zinc-400"
                      : "fill-purple-500 text-purple-500"
                  )}
                />
              )}
              <button
                type="button"
                className={cn(
                  "rounded p-1 transition-colors",
                  discussion.isMuted
                    ? "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                    : "text-muted-foreground hover:bg-zinc-100 hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleDiscussionMute(discussion.id)
                }}
                aria-label={discussion.isMuted ? "Unmute discussion" : "Mute discussion"}
                title={discussion.isMuted ? "Unmute discussion" : "Mute discussion"}
              >
                {discussion.isMuted ? (
                  <BellOff className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                className={
                  discussion.isFavorite
                    ? "text-purple-500 transition-colors hover:text-purple-600"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleDiscussionFavorite(discussion.id)
                }}
                aria-label={
                  discussion.isFavorite
                    ? "Remove discussion from favorites"
                    : "Add discussion to favorites"
                }
                title={
                  discussion.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Star
                  className="h-5 w-5"
                  fill={discussion.isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
          <div className="mt-2 ml-8">
            <p className="text-sm text-muted-foreground">
              Due date:{" "}
              <span
                className={cn(
                  discussion.isMuted ? "text-zinc-500" : "text-purple-600"
                )}
              >
                {discussion.dueDate}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {discussion.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
