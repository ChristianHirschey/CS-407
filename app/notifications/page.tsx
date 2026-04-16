"use client"

import Link from "next/link"
import {
  Bell,
  BellOff,
  Megaphone,
  GraduationCap,
  MessageSquare,
  FileText,
  Mail,
  Check,
  CheckCheck,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { cn } from "@/lib/utils"

function getDiscussionIdFromLink(link?: string): string | null {
  if (!link) return null
  // Expected: /courses/:courseId/discussions/:discussionId
  const match = link.match(/\/discussions\/([^/?#]+)/i)
  return match?.[1] ?? null
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "announcement":
      return <Megaphone className="h-5 w-5" />
    case "grade":
      return <GraduationCap className="h-5 w-5" />
    case "discussion":
      return <MessageSquare className="h-5 w-5" />
    case "assignment":
      return <FileText className="h-5 w-5" />
    case "message":
      return <Mail className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "announcement":
      return "bg-purple-100 text-purple-600"
    case "grade":
      return "bg-green-100 text-green-600"
    case "discussion":
      return "bg-blue-100 text-blue-600"
    case "assignment":
      return "bg-amber-100 text-amber-600"
    case "message":
      return "bg-pink-100 text-pink-600"
    default:
      return "bg-zinc-100 text-zinc-600"
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    getDiscussion,
    toggleDiscussionMute,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
  } = useData()

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) return 0
    return a.isRead ? 1 : -1
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-zinc-200 bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <h1 className="text-3xl font-light text-foreground">
                Notifications
              </h1>
              {unreadNotificationCount > 0 && (
                <span className="rounded-full bg-purple-500 px-2 py-0.5 text-sm font-medium text-white">
                  {unreadNotificationCount} unread
                </span>
              )}
            </div>
            {unreadNotificationCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllNotificationsRead}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-lg border border-zinc-200 bg-white divide-y divide-zinc-100">
            {sortedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-3" />
                <p>No notifications yet</p>
              </div>
            ) : (
              sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 px-4 py-4 transition-colors",
                    !notification.isRead && "bg-purple-50/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={cn(
                            "font-medium",
                            !notification.isRead && "text-purple-700"
                          )}
                        >
                          {notification.title}
                        </h3>
                        {notification.courseName && (
                          <p className="text-sm text-muted-foreground">
                            {notification.courseName}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {(() => {
                          const discussionId = getDiscussionIdFromLink(notification.link)
                          if (!discussionId) return null
                          const discussion = getDiscussion(discussionId)
                          if (!discussion) return null
                          const muted = discussion.isMuted ?? false
                          return (
                            <button
                              onClick={() => toggleDiscussionMute(discussionId)}
                              className={cn(
                                "rounded p-1 text-muted-foreground hover:bg-zinc-100 hover:text-foreground",
                                muted && "text-zinc-500"
                              )}
                              title={muted ? "Unmute discussion" : "Mute discussion"}
                              aria-label={muted ? "Unmute discussion" : "Mute discussion"}
                            >
                              {muted ? (
                                <BellOff className="h-4 w-4" />
                              ) : (
                                <Bell className="h-4 w-4" />
                              )}
                            </button>
                          )
                        })()}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.createdAt}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markNotificationRead(notification.id)
                            }
                            className="rounded p-1 text-muted-foreground hover:bg-zinc-100 hover:text-foreground"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="mt-2 inline-block text-sm text-purple-600 hover:underline"
                      >
                        View details
                      </Link>
                    )}
                  </div>

                  {!notification.isRead && (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-purple-500 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
