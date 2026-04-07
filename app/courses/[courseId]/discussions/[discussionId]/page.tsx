"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  X,
  RefreshCw,
  Bell,
  BellOff,
  Calendar,
  MessageSquare,
  Mail,
  Star,
  Search,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useData } from "@/lib/data-context"
import { discussionParticipants } from "@/lib/data"
import { cn } from "@/lib/utils"
import type { DiscussionSendMode } from "@/lib/types"

interface DiscussionPageProps {
  params: Promise<{ courseId: string; discussionId: string }>
}

export default function DiscussionPage({ params }: DiscussionPageProps) {
  const { courseId, discussionId } = use(params)
  const [newPost, setNewPost] = useState("")
  const [sendMode, setSendMode] = useState<DiscussionSendMode>("message")
  const [expandedReplies, setExpandedReplies] = useState<string[]>([])

  const {
    getCourse,
    getDiscussion,
    getPostsForDiscussion,
    addPost,
    markAllPostsReadForDiscussion,
    toggleDiscussionFavorite,
    toggleDiscussionMute,
  } = useData()

  const course = getCourse(courseId)
  const discussion = getDiscussion(discussionId)
  const posts = getPostsForDiscussion(discussionId)

  if (!course || !discussion) {
    notFound()
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      addPost(discussionId, newPost.trim(), sendMode)
      setNewPost("")
    }
  }

  const isFavorited = discussion.isFavorited ?? false
  const isMuted = discussion.isMuted ?? false

  const sendViaLabel = (mode: DiscussionSendMode | undefined) => {
    switch (mode) {
      case "email":
        return "Emailed"
      case "both":
        return "Posted + emailed"
      default:
        return "Posted"
    }
  }

  const handleMarkAllRead = () => {
    markAllPostsReadForDiscussion(discussionId)
  }

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const newPostsCount = posts.filter((p) => p.isNew).length

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="w-12 bg-purple-600 flex flex-col items-center py-4 gap-4">
        <Link
          href={`/courses/${courseId}?tab=discussions`}
          className="text-white hover:bg-purple-700 p-2 rounded"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{course.code}</div>
              <h1 className="text-2xl font-medium">{discussion.title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(isFavorited && "text-amber-500")}
                onClick={() => toggleDiscussionFavorite(discussionId)}
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Star
                  className={cn("h-5 w-5", isFavorited && "fill-current")}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(isMuted && "text-muted-foreground")}
                onClick={() => toggleDiscussionMute(discussionId)}
                aria-label={isMuted ? "Unmute discussion" : "Mute discussion"}
              >
                {isMuted ? (
                  <BellOff className="h-5 w-5" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          {(isFavorited || isMuted) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {isFavorited && (
                <Badge variant="secondary" className="text-xs font-normal">
                  Favorited
                </Badge>
              )}
              {isMuted && (
                <Badge variant="outline" className="text-xs font-normal">
                  Muted — fewer notifications
                </Badge>
              )}
            </div>
          )}
        </header>

        <div className="flex">
          <main className="flex-1 p-6">
            <div className="rounded-lg border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <h2 className="font-medium">Discussion Topic</h2>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllRead}
                    disabled={newPostsCount === 0}
                  >
                    Mark all as Read
                  </Button>
                  <button className="text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Follow the instructions below to complete the discussion:
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>
                    In the &quot;Response&quot; area below, post a 100-200 word
                    introduction of yourself. You may include information about
                    your personal, academic, and/or professional life or
                    aspirations.
                  </li>
                  <li>Select &quot;Respond&quot; to post your response.</li>
                  <li>Read your classmates&apos; posts.</li>
                  <li>Respond to at least two of your classmates&apos; posts.</li>
                </ol>
              </div>

              <div className="border-b border-zinc-200 px-4 py-3 space-y-3">
                <div>
                  <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Send as
                  </div>
                  <ToggleGroup
                    type="single"
                    value={sendMode}
                    onValueChange={(v) => {
                      if (v) setSendMode(v as DiscussionSendMode)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full max-w-md"
                  >
                    <ToggleGroupItem
                      value="message"
                      aria-label="Post to discussion only"
                      className="flex-1 gap-1.5 px-2"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      Message
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="email"
                      aria-label="Email only"
                      className="flex-1 gap-1.5 px-2"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      Email
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="both"
                      aria-label="Post and email"
                      className="flex-1 gap-1.5 px-2"
                    >
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="h-3 w-3" />
                        <Mail className="h-3 w-3" />
                      </span>
                      Both
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {sendMode === "message" &&
                      "Your text appears in the discussion thread only."}
                    {sendMode === "email" &&
                      "Participants are notified by email (thread updated for grading)."}
                    {sendMode === "both" &&
                      "Posted to the thread and sent to participants by email."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type a Post"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="flex-1 resize-none"
                    rows={2}
                  />
                  <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                    Post
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-zinc-100">
                {posts.map((post) => (
                  <div key={post.id} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{post.authorName}</span>
                          {post.sendVia && post.sendVia !== "message" && (
                            <Badge
                              variant="outline"
                              className="gap-1 text-xs font-normal"
                            >
                              {post.sendVia === "email" ? (
                                <Mail className="h-3 w-3" />
                              ) : (
                                <>
                                  <MessageSquare className="h-3 w-3" />
                                  <Mail className="h-3 w-3" />
                                </>
                              )}
                              {sendViaLabel(post.sendVia)}
                            </Badge>
                          )}
                          {post.isNew && (
                            <Badge
                              variant="secondary"
                              className="bg-green-500 text-white text-xs"
                            >
                              NEW
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.postedAt}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed">
                          {post.content}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-purple-600 hover:underline">
                            <CornerDownRight className="h-4 w-4" />
                            Reply
                          </button>
                          <button
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => toggleReplies(post.id)}
                          >
                            Show Replies (1)
                            {expandedReplies.includes(post.id) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="w-80 shrink-0 border-l border-zinc-200 bg-white p-6">
            <h2 className="font-medium">Details &amp; Information</h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Due Date</div>
                  <div className="text-sm text-muted-foreground">
                    {discussion.dueDate}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Grading</div>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm">Maximum grade</span>
                  <span className="font-medium">
                    {discussion.grade?.total || 100} points
                  </span>
                </div>
              </div>

              {discussion.grade && (
                <div>
                  <div className="text-sm font-medium">Grade</div>
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">Discussion</span>
                    <Badge className="bg-green-500 text-white">
                      {discussion.grade.score} / {discussion.grade.total}
                    </Badge>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-medium">Participation</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                Total posts: {discussion.totalPosts} | Total replies:{" "}
                {discussion.totalReplies}
              </div>

              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Find participants" className="pl-9" />
              </div>

              <div className="mt-4 space-y-3">
                {discussionParticipants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          participant.isCurrentUser && "text-purple-600"
                        )}
                      >
                        {participant.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {participant.posts} Post{participant.posts !== 1 && "s"}{" "}
                        | {participant.replies} Replies
                      </div>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-purple-600 hover:underline">
                  +100 more...
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
