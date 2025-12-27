import { Shell } from '@/components/layout/Shell'

export default function AboutPage() {
  return (
    <Shell>
      <div className="p-6 md:p-12 max-w-4xl">
        <h1 className="text-3xl font-light mb-8">About</h1>
        <div className="space-y-6">
          <p className="text-base leading-relaxed">
            About page content will be loaded from Supabase in Step 4.
          </p>
          <p className="text-sm text-gray-500">
            This is a placeholder shell for the about page.
          </p>
        </div>
      </div>
    </Shell>
  )
}
