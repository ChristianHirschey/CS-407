"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type {
  Course,
  ContentItem,
  Announcement,
  Discussion,
  DiscussionPost,
  RosterMember,
  Notification,
  CalendarEvent,
  Assignment,
} from "./types"
import {
  courses as initialCourses,
  contentItems as initialContent,
  announcements as initialAnnouncements,
  discussions as initialDiscussions,
  discussionPosts as initialPosts,
  rosterMembers as initialRoster,
  notifications as initialNotifications,
  calendarEvents as initialEvents,
  assignments as initialAssignments,
} from "./data"

interface DataContextType {
  courses: Course[]
  contentItems: ContentItem[]
  announcements: Announcement[]
  discussions: Discussion[]
  discussionPosts: DiscussionPost[]
  rosterMembers: RosterMember[]
  notifications: Notification[]
  calendarEvents: CalendarEvent[]
  assignments: Assignment[]
  
  // Course helpers
  getCourse: (id: string) => Course | undefined
  toggleFavorite: (courseId: string) => void
  getUpcomingAssignmentForCourse: (courseId: string) => Assignment | undefined
  
  // Content helpers
  getContentForCourse: (courseId: string) => ContentItem[]
  
  // Announcement helpers
  getAnnouncementsForCourse: (courseId: string) => Announcement[]
  markAnnouncementRead: (id: string) => void
  markAllAnnouncementsReadForCourse: (courseId: string) => void
  
  // Discussion helpers
  getDiscussionsForCourse: (courseId: string) => Discussion[]
  getDiscussion: (id: string) => Discussion | undefined
  getPostsForDiscussion: (discussionId: string) => DiscussionPost[]
  toggleDiscussionFavorite: (discussionId: string) => void
  addPost: (discussionId: string, content: string) => void
  markDiscussionRead: (id: string) => void
  markAllDiscussionsReadForCourse: (courseId: string) => void
  markAllPostsReadForDiscussion: (discussionId: string) => void
  
  // Assignment helpers
  getAssignmentsForCourse: (courseId: string) => Assignment[]
  getAssignment: (id: string) => Assignment | undefined
  
  // Roster helpers
  getRosterForCourse: (courseId: string) => RosterMember[]
  
  // Notification helpers
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  unreadNotificationCount: number
  
  // Calendar helpers
  getEventsForCourse: (courseId: string) => CalendarEvent[]
  getAllEvents: () => CalendarEvent[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [contentItems] = useState<ContentItem[]>(initialContent)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(initialPosts)
  const [rosterMembers] = useState<RosterMember[]>(initialRoster)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [calendarEvents] = useState<CalendarEvent[]>(initialEvents)
  const [assignments] = useState<Assignment[]>(initialAssignments)

  const getCourse = (id: string) => courses.find((c) => c.id === id)

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c))
    )
  }

  const getUpcomingAssignmentForCourse = (courseId: string) => {
    const courseAssignments = assignments.filter((a) => a.courseId === courseId)
    // Return the first upcoming assignment (in a real app, would check dates)
    return courseAssignments[0]
  }

  const getContentForCourse = (courseId: string) =>
    contentItems.filter((c) => c.courseId === courseId)

  const getAnnouncementsForCourse = (courseId: string) =>
    announcements.filter((a) => a.courseId === courseId)

  const markAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    )
  }

  const markAllAnnouncementsReadForCourse = (courseId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.courseId === courseId ? { ...a, isRead: true } : a))
    )
  }

  const getDiscussionsForCourse = (courseId: string) =>
    discussions.filter((d) => d.courseId === courseId)

  const getDiscussion = (id: string) => discussions.find((d) => d.id === id)

  const getPostsForDiscussion = (discussionId: string) =>
    discussionPosts.filter((p) => p.discussionId === discussionId)

  const toggleDiscussionFavorite = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, isFavorite: !discussion.isFavorite }
          : discussion
      )
    )
  }

  const addPost = (discussionId: string, content: string) => {
    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      discussionId,
      authorName: "Alex Student",
      content,
      postedAt: new Date().toLocaleString(),
      isNew: true,
    }
    setDiscussionPosts((prev) => [newPost, ...prev])
  }

  const markDiscussionRead = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: true } : d))
    )
  }

  const markAllDiscussionsReadForCourse = (courseId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.courseId === courseId ? { ...d, isCompleted: true } : d))
    )
  }

  const markAllPostsReadForDiscussion = (discussionId: string) => {
    setDiscussionPosts((prev) =>
      prev.map((p) => (p.discussionId === discussionId ? { ...p, isNew: false } : p))
    )
  }

  const getAssignmentsForCourse = (courseId: string) =>
    assignments.filter((a) => a.courseId === courseId)

  const getAssignment = (id: string) => assignments.find((a) => a.id === id)

  const getRosterForCourse = (courseId: string) =>
    rosterMembers.filter((m) => m.courseId === courseId)

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length

  const getEventsForCourse = (courseId: string) =>
    calendarEvents.filter((e) => e.courseId === courseId)

  const getAllEvents = () => calendarEvents

  return (
    <DataContext.Provider
      value={{
        courses,
        contentItems,
        announcements,
        discussions,
        discussionPosts,
        rosterMembers,
        notifications,
        calendarEvents,
        assignments,
        getCourse,
        toggleFavorite,
        getUpcomingAssignmentForCourse,
        getContentForCourse,
        getAnnouncementsForCourse,
        markAnnouncementRead,
        markAllAnnouncementsReadForCourse,
        getDiscussionsForCourse,
        getDiscussion,
        getPostsForDiscussion,
        toggleDiscussionFavorite,
        addPost,
        markDiscussionRead,
        markAllDiscussionsReadForCourse,
        markAllPostsReadForDiscussion,
        getAssignmentsForCourse,
        getAssignment,
        getRosterForCourse,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationCount,
        getEventsForCourse,
        getAllEvents,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
