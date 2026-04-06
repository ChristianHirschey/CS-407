"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Building2,
  Activity,
  BookOpen,
  Calendar,
  Mail,
  FileText,
  Sparkles,
  Wrench,
  LogOut,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

const navItems = [
  { icon: Home, label: "Institution Page", href: "#" },
  { icon: Activity, label: "Activity", href: "#" },
  { icon: BookOpen, label: "Courses", href: "/" },
  { icon: Calendar, label: "Calendar", href: "#" },
  { icon: Mail, label: "Messages", href: "#" },
  { icon: FileText, label: "Grades", href: "#" },
  { icon: Sparkles, label: "Assist", href: "#" },
  { icon: Wrench, label: "Tools", href: "#" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { unreadNotificationCount } = useData()

  return (
    <aside className="flex h-screen w-44 flex-col bg-zinc-900 text-white">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">CS407</span>
          <span className="text-purple-400">*</span>
        </Link>
      </div>

      <div className="border-b border-zinc-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700">
            <span className="text-xs">AS</span>
          </div>
          <span className="text-sm">Alex Student</span>
        </div>
      </div>

      <nav className="flex-1 py-2">
        <Link
          href="/notifications"
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-800",
            pathname === "/notifications" && "border-l-4 border-purple-500 bg-zinc-800"
          )}
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs">
              {unreadNotificationCount}
            </span>
          )}
        </Link>
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-800",
                isActive && "border-l-4 border-purple-500 bg-zinc-800"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-700 p-4">
        <button className="flex w-full items-center gap-3 text-sm hover:text-zinc-300">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="border-t border-zinc-700 px-4 py-2 text-xs text-zinc-500">
        <span>Privacy • Terms • Accessibility</span>
      </div>
    </aside>
  )
}
