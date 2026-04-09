"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  X,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface RosterPageProps {
  params: Promise<{ courseId: string }>
}

export default function RosterPage({ params }: RosterPageProps) {
  const { courseId } = use(params)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [messageType, setMessageType] = useState<"message" | "email">("message")

  const { getCourse, getRosterForCourse } = useData()

  const course = getCourse(courseId)
  const rosterMembers = getRosterForCourse(courseId)

  if (!course) {
    notFound()
  }

  const filteredMembers = rosterMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const allRosterMembersSelected =
    rosterMembers.length > 0 && selectedMembers.length === rosterMembers.length

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const selectAllMembers = () => {
    setSelectedMembers(filteredMembers.map((m) => m.id))
  }

  const handleSendMessage = () => {
    if (messageContent.trim() && selectedMembers.length > 0) {
      toast.success(
        `Message sent to ${selectedMembers.length} recipient${
          selectedMembers.length > 1 ? "s" : ""
        }!`
      )
      setMessageContent("")
      setSelectedMembers([])
      setIsMessageDialogOpen(false)
    }
  }

  const selectedMemberNames = rosterMembers
    .filter((m) => selectedMembers.includes(m.id))
    .map((m) => m.name)

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="w-12 bg-purple-600 flex flex-col items-center py-4 gap-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-white hover:bg-purple-700 p-2 rounded"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                {course.term.slice(0, 5)}.{course.term} - {course.code}
              </div>
              <h1 className="text-2xl font-medium">Roster</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="w-64 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsMessageDialogOpen(true)}
                disabled={selectedMembers.length === 0}
                className={cn(
                  selectedMembers.length > 0 &&
                    "border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
                )}
              >
                Message
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1 rounded border border-zinc-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded p-1.5",
                    viewMode === "grid" ? "bg-zinc-100" : "hover:bg-zinc-50"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded p-1.5",
                    viewMode === "list" ? "bg-zinc-100" : "hover:bg-zinc-50"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="outline"
                onClick={selectAllMembers}
                disabled={allRosterMembersSelected}
              >
                Select all
              </Button>
            </div>

            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              All course members ({filteredMembers.length}){" "}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-2"
            )}
          >
            {filteredMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id)
              return (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border bg-white p-4 transition-colors cursor-pointer",
                    isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-zinc-200 hover:bg-zinc-50"
                  )}
                  onClick={() => toggleMemberSelection(member.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleMemberSelection(member.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Avatar>
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{member.name}</div>
                    {member.pronouns && (
                      <div className="text-xs text-muted-foreground">
                        {member.pronouns}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {member.role === "Instructor" ? (
                        <Badge
                          variant="secondary"
                          className="bg-zinc-900 text-white text-xs"
                        >
                          INSTRUCTOR
                        </Badge>
                      ) : (
                        member.role
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </div>
                  </div>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex rounded-md border border-zinc-200 overflow-hidden">
              <button
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  messageType === "message"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-muted-foreground hover:bg-zinc-50"
                )}
                onClick={() => setMessageType("message")}
              >
                Message
              </button>
              <button
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  messageType === "email"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-muted-foreground hover:bg-zinc-50"
                )}
                onClick={() => setMessageType("email")}
              >
                Email
              </button>
            </div>
            <div>
              <label className="text-sm font-medium">Recipients</label>
              <div className="mt-1 flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 min-h-10">
                {selectedMemberNames.slice(0, 3).map((name, index) => (
                  <Badge key={index} variant="secondary">
                    {name}
                  </Badge>
                ))}
                {selectedMemberNames.length > 3 && (
                  <Badge variant="outline">
                    +{selectedMemberNames.length - 3} more
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-6 text-xs"
                  onClick={selectAllMembers}
                >
                  All
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                className="mt-1"
                rows={5}
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
