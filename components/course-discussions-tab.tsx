"use client"

import Link from "next/link"
import {
  MessageSquare,
  CheckCircle2,
  Circle,
  Folder,
  Star,
  Bell,
  BellOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { cn } from "@/lib/utils"
import type { Discussion } from "@/lib/types"

interface CourseDiscussionsTabProps {
  courseId: string
}

function sortDiscussionsForList(list: Discussion[]): Discussion[] {
  return [...list].sort((a, b) => {
    const fav = Number(b.isFavorited ?? false) - Number(a.isFavorited ?? false)
    if (fav !== 0) return fav
    return Number(a.isMuted ?? false) - Number(b.isMuted ?? false)
  })
}

export function CourseDiscussionsTab({ courseId }: CourseDiscussionsTabProps) {
  const {
    getDiscussionsForCourse,
    toggleDiscussionFavorite,
    toggleDiscussionMute,
  } = useData()
  const discussions = sortDiscussionsForList(
    getDiscussionsForCourse(courseId)
  )

  return (
    <div className="mx-auto max-w-4xl py-6 space-y-4">
      {discussions.map((discussion) => {
        const favorited = discussion.isFavorited ?? false
        const muted = discussion.isMuted ?? false
        return (
          <div
            key={discussion.id}
            className={cn(
              "rounded-lg border border-zinc-200 bg-white p-4 transition-shadow",
              muted && "opacity-80",
              "hover:shadow-sm"
            )}
          >
            <div className="flex items-start gap-3">
              <Link
                href={`/courses/${courseId}/discussions/${discussion.id}`}
                className="mt-1 shrink-0"
              >
                {discussion.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300" />
                )}
              </Link>
              <Link
                href={`/courses/${courseId}/discussions/${discussion.id}`}
                className="min-w-0 flex-1"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MessageSquare className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <h3 className="font-medium">{discussion.title}</h3>
                  {favorited && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                      <Star className="h-3 w-3 fill-current" />
                      Favorite
                    </span>
                  )}
                  {muted && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      Muted
                    </span>
                  )}
                  {discussion.grade && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {discussion.grade.score}/{discussion.grade.total}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Due date:{" "}
                  <span className="text-purple-600">{discussion.dueDate}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {discussion.description}
                </p>
              </Link>
              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", favorited && "text-amber-500")}
                  aria-label={
                    favorited ? "Remove from favorites" : "Add to favorites"
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    toggleDiscussionFavorite(discussion.id)
                  }}
                >
                  <Star
                    className={cn("h-4 w-4", favorited && "fill-current")}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={muted ? "Unmute discussion" : "Mute discussion"}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleDiscussionMute(discussion.id)
                  }}
                >
                  {muted ? (
                    <BellOff className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )
      })}
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
