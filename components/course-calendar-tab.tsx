"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import type { CalendarEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CourseCalendarTabProps {
  events: CalendarEvent[]
  courseName?: string
}

export function CourseCalendarTab({ events, courseName }: CourseCalendarTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventDates = events.map((e) => new Date(e.date))

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (e) =>
        new Date(e.date).toDateString() === date.toDateString()
    )
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const modifiers = {
    hasEvent: eventDates,
  }

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: "#8B5CF6",
      color: "white",
      borderRadius: "50%",
    },
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="flex gap-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md"
          />
        </div>

        <div className="flex-1">
          <h2 className="mb-4 text-lg font-medium">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Select a date"}
          </h2>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "rounded-lg border border-zinc-200 bg-white p-4",
                    event.type === "discussion" && "border-l-4 border-l-purple-500",
                    event.type === "assignment" && "border-l-4 border-l-blue-500",
                    event.type === "exam" && "border-l-4 border-l-red-500"
                  )}
                >
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {event.courseName}
                  </div>
                  <div className="mt-1 font-medium">{event.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground capitalize">
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-muted-foreground">
              No events scheduled for this date
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-medium">Upcoming Events</h3>
        <div className="rounded-lg border border-zinc-200 bg-white divide-y divide-zinc-100">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50"
              >
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    event.type === "discussion" && "bg-purple-500",
                    event.type === "assignment" && "bg-blue-500",
                    event.type === "exam" && "bg-red-500"
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {event.courseName}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
