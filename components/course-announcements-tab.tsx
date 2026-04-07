"use client"

import { useState } from "react"
import { Search, Megaphone, ChevronUp, ChevronDown, Circle } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CourseAnnouncementsTabProps {
  announcements: Announcement[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export function CourseAnnouncementsTab({
  announcements,
  onMarkRead,
  onMarkAllRead,
}: CourseAnnouncementsTabProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const unreadCount = announcements.filter((a) => !a.isRead).length
  const totalCount = announcements.length

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // Parse dates for sorting
    const dateA = new Date(a.postedAt)
    const dateB = new Date(b.postedAt)
    return sortDirection === "desc"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">
          {unreadCount} new ({totalCount} total)
        </span>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="w-48 pl-9" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            Announcement
            <button
              className="flex flex-col"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              <ChevronUp className="h-3 w-3" />
              <ChevronDown className="-mt-1 h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            Date
            <button
              className="flex flex-col"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              <ChevronUp className="h-3 w-3" />
              <ChevronDown className="-mt-1 h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {sortedAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={cn(
                "flex items-start gap-4 px-4 py-4 cursor-pointer transition-colors",
                announcement.isRead
                  ? "bg-zinc-100 hover:bg-zinc-150"
                  : "bg-white hover:bg-zinc-50"
              )}
              onClick={() => !announcement.isRead && onMarkRead(announcement.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={announcement.isRead}
                  onCheckedChange={() => onMarkRead(announcement.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Megaphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium",
                    announcement.isRead && "text-muted-foreground"
                  )}
                >
                  {announcement.title.includes("EXTENSION") && (
                    <span className="text-pink-500">* </span>
                  )}
                  <span
                    className={cn(
                      announcement.title.includes("EXTENSION") &&
                        !announcement.isRead &&
                        "text-purple-600"
                    )}
                  >
                    {announcement.title.includes("EXTENSION")
                      ? announcement.title.split("and")[0]
                      : ""}
                  </span>
                  {announcement.title.includes("EXTENSION") && (
                    <span className="text-pink-500">* </span>
                  )}
                  {announcement.title.includes("EXTENSION")
                    ? "and" + announcement.title.split("and")[1]
                    : announcement.title}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-sm line-clamp-1",
                    announcement.isRead
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {announcement.content}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm",
                    announcement.isRead
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {announcement.postedAt}
                </span>
                {!announcement.isRead && (
                  <Circle className="h-2 w-2 fill-purple-500 text-purple-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
