export interface Course {
  id: string
  code: string
  name: string
  term: string
  instructor: string
  instructorRole: string
  schedule: {
    days: string
    time: string
    location: string
  }
  color: string
  isFavorite: boolean
}

export interface ContentItem {
  id: string
  courseId: string
  title: string
  type: "link" | "document" | "folder"
  isExpanded?: boolean
  hasAlert?: boolean
  children?: ContentItem[]
}

export interface Announcement {
  id: string
  courseId: string
  title: string
  content: string
  postedAt: string
  isRead: boolean
}

export interface Discussion {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  isFavorite: boolean
  isCompleted: boolean
  totalPosts: number
  totalReplies: number
  grade?: {
    score: number
    total: number
  }
}

export interface DiscussionPost {
  id: string
  discussionId: string
  authorName: string
  authorAvatar?: string
  content: string
  postedAt: string
  isNew: boolean
  replies?: DiscussionPost[]
}

export interface RosterMember {
  id: string
  courseId: string
  name: string
  role: "Instructor" | "Student" | "TA"
  email: string
  avatar?: string
  pronouns?: string
}

export interface Notification {
  id: string
  title: string
  content: string
  courseId?: string
  courseName?: string
  type: "announcement" | "grade" | "discussion" | "assignment" | "message"
  createdAt: string
  isRead: boolean
  link?: string
}

export interface CalendarEvent {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  type: "discussion" | "assignment" | "exam"
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  dueDateISO: string
  maxPoints: number
  attempts: string
  type: "individual" | "group"
  groupMembers?: string[]
}