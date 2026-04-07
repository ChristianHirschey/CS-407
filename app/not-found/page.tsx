'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DemoPlaceholderPage() {
  const router = useRouter()
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        This page will not be implemented for the purposes of our demo.
      </h1>
      <Button type="button" variant="outline" onClick={handleBack}>
        Back
      </Button>
    </main>
  )
}
