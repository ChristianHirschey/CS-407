"use client"

import { useState } from "react"
import { Search, LayoutGrid, List } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/lib/data-context"

export default function CoursesPage() {
  const { courses } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const favoriteCourses = filteredCourses.filter((c) => c.isFavorite)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-zinc-200 bg-white px-6 py-6">
          <h1 className="text-3xl font-light text-foreground">Courses</h1>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 rounded border border-zinc-200 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded p-1.5 ${
                  viewMode === "list" ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded p-1.5 ${
                  viewMode === "grid" ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your courses"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select defaultValue="all-terms">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-terms">All Terms</SelectItem>
                <SelectItem value="202610">Spring 2026</SelectItem>
                <SelectItem value="202580">Fall 2025</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-courses">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-courses">All courses</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="25">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">items per page</span>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredCourses.length} results
          </div>
        </div>

        <div className="px-6">
          {favoriteCourses.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-medium">Favorites</h2>
              <div className="rounded-lg border border-zinc-200 bg-white">
                {favoriteCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
