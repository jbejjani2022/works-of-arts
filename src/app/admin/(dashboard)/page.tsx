export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-light">Welcome to the Admin Dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          This is a placeholder for the CMS functionality that will be
          implemented in Step 6.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-medium">Artworks</h3>
          <p className="text-sm text-gray-600">
            Manage your portfolio artworks - coming soon in Step 6
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-medium">Bio</h3>
          <p className="text-sm text-gray-600">
            Edit your artist bio - coming soon in Step 6
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-medium">CV</h3>
          <p className="text-sm text-gray-600">
            Upload and manage your CV - coming soon in Step 6
          </p>
        </div>
      </div>
    </div>
  )
}
