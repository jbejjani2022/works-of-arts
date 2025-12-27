// Export clients
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'

// Export query helpers
export * from './queries'

// Export storage helpers
export * from './storage'

// Export types
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types'
