Project description: Minimal, modern, responsive website for an artist's portfolio, with a simple CMS.

## 1. Tech stack & infrastructure

### Core stack

* **Framework:** Next.js (App Router, TypeScript)
* **Runtime:** Node / Edge (as appropriate; default Node is fine)
* **Language:** TypeScript
* **Styling:** Tailwind CSS

### Backend & data

* **Supabase**:

  * **PostgreSQL** for `artworks` and `bio` tables.
  * **Supabase Auth** for artist login (email/password).
  * **Supabase Storage** for artwork images.
  * **Row Level Security (RLS)**:

    * Anonymous read access for public content (artworks, bio).
    * Authenticated-only write access.

### Deployment & hosting

* **Frontend/Serverless functions:** Vercel

  * Connect GitHub repo → auto deploy on push.
  * Environment variables set in Vercel dashboard.
* **Database/Auth/Storage:** Supabase

  * Separate project with:

    * `artworks` table
    * `bio` table
    * `artworks` storage bucket

### Key dependencies

* `next`, `react`, `react-dom`
* `typescript`
* `tailwindcss`, `postcss`, `autoprefixer`
* `@supabase/supabase-js`
* `@supabase/auth-helpers-nextjs` (for easier auth handling in Next App Router)
* `@supabase/auth-ui-react` (for quick login UI)
* `zod` + `@hookform/resolvers`, `react-hook-form` (for admin forms & validation)
* Optional QoL:

  * `clsx` or `classnames` for conditional classNames
  * `date-fns` for formatting timestamps in CMS

---

## 2. Data model & Supabase setup

### Tables

#### `artworks`

Columns:

* `id`: `uuid` (primary key, default `uuid_generate_v4()`)
* `title`: `text` (required)
* `year`: `integer` (optional or required; up to you)
* `medium`: `text` (enum-like: `"Painting" | "Work on Paper" | "Sculpture"`)
* `details`: `text` (e.g. `"Pastel on paper"`)
* `height`: `numeric` (or `float8`) – dimensions will be inches
* `width`: `numeric`
* `length`: `numeric` (nullable; only for Sculpture)
* `image_url`: `text` (required; public URL from Supabase Storage)
* `created_at`: `timestamp with time zone` (default `now()`)
* `updated_at`: `timestamp with time zone` (default `now()`, updated on change)

Indexes:

* Index on `medium` for filtering.
* Index on `created_at` (for ordering).

#### `bio`

Columns:

* `id`: `uuid` (primary key, single-row table, or use fixed ID)
* `content`: `text` (required)
* `updated_at`: `timestamp with time zone` (default `now()`)

### Auth

* Supabase Auth with **email/password**.
* Only one “artist” account in practice
* RLS policies:

  * `artworks`:

    * `SELECT`: allow for `anon` and `authenticated` (public read).
    * `INSERT/UPDATE/DELETE`: allow only for authenticated users with a specific role or just any authenticated user (simplest for single owner).
  * `bio`:

    * `SELECT`: allow `anon`.
    * `UPDATE`: allow authenticated users.

### Storage

* Bucket: `artworks`

  * Public or restricted access:

    * Easiest: **public** bucket + random filenames → use directly in `<Image>`.
* Upload flow:

  1. Admin uploads file via `/admin` form.
  2. Client calls Supabase Storage to upload (`supabase.storage.from('artworks').upload(path, file)`).
  3. Get public URL via `getPublicUrl(path)`.
  4. Save URL to `image_url` field in `artworks` table.

---

## 3. Project structure (Next.js App Router)

Example file/folder layout:

```text
/
├─ app/
│  ├─ layout.tsx                # Root layout (HTML, <body>, global sidebar wrapper)
│  ├─ globals.css               # Tailwind base imports
│  ├─ page.tsx                  # Home page (/)
│  ├─ about/
│  │   └─ page.tsx              # About page (/about)
│  ├─ artworks/
│  │   └─ page.tsx              # Artworks page (/artworks)
│  ├─ admin/
│  │   ├─ layout.tsx            # Admin layout (auth-protected shell)
│  │   ├─ page.tsx              # Admin dashboard (/admin) - table + bio editor
│  │   └─ login/
│  │       └─ page.tsx          # Login page (/admin/login)
│  ├─ api/
│  │   ├─ revalidate/route.ts   # (Optional) for on-demand revalidation hooks
│  │   ├─ artworks/
│  │   │   └─ route.ts          # (Optional) CRUD API if you prefer API-layer between UI and Supabase
│  │   └─ bio/
│  │       └─ route.ts          # (Optional) Bio save endpoint
│
├─ components/
│  ├─ layout/
│  │   ├─ Sidebar.tsx
│  │   ├─ SidebarToggle.tsx     # Name + hamburger for home page
│  │   └─ Shell.tsx             # Layout combining sidebar + content
│  ├─ artworks/
│  │   ├─ ArtworksGrid.tsx      # Reusable grid for displaying artworks
│  │   └─ ArtworkCard.tsx       # Single artwork tile
│  ├─ admin/
│  │   ├─ ArtworksTable.tsx
│  │   ├─ ArtworkForm.tsx       # Create/edit form
│  │   ├─ BioEditor.tsx
│  │   └─ ConfirmDialog.tsx     # Reusable delete confirmation
│  └─ ui/
│      ├─ Button.tsx
│      ├─ Input.tsx
│      ├─ Textarea.tsx
│      └─ Select.tsx
│
├─ lib/
│  ├─ supabase/
│  │   ├─ client.ts             # Supabase client for client components
│  │   └─ server.ts             # Supabase client for server components (auth-helpers)
│  ├─ types.ts                  # Artwork, Bio types
│  ├─ validation.ts             # Zod schemas for forms
│  └─ utils.ts                  # Misc helpers
│
├─ public/
│  └─ placeholder-artist.jpg    # Fallback artist photo, etc.
│
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ tsconfig.json
└─ next.config.mjs
```

> Note: Let's start by just collapsing the API layer and talking directly to Supabase from client components in `/admin`. This will rely entirely on RLS.

---

## 4. Layout & shared design

### Global layout (`app/layout.tsx`)

* Includes:

  * `<html lang="en">`, `<body className="bg-black text-white">` (or your palette)
  * Tailwind reset and fonts.
* The layout should render:

  * A **sidebar component** that:

    * Is togglable on the home page.
    * Is always visible on `/about` and `/artworks`.
  * A main content area for page children.

Behavior:

* Use route info (`usePathname` in a client layout wrapper, or page-level logic) to:

  * On `/` (home): sidebar starts **closed**, opened via clicking artist name or menu icon.
  * On `/about` and `/artworks`: sidebar is **always open**, no toggle.

### Sidebar (`components/layout/Sidebar.tsx`)

* Contains:

  * Artist name (clickable on home to toggle).
  * Menu icon (3 lines) next to the name **on the home page only**.
  * Navigation links:

    * `About` → `/about`
    * `Artworks` → `/artworks`

      * When on `/artworks`, show nested items:

        * `Paintings`
        * `Works on Paper`
        * `Sculpture`
* On `/artworks`, clicking `Paintings`, `Works on Paper`, or `Sculpture` updates the filter in the main content area (see below).

Responsive:

* Desktop:

  * Sidebar can be a fixed column on the left.
* Mobile:

  * Sidebar can collapse back into the menu icon to make space for the content. No need to keep it always open like on desktop.

---

## 5. Page specifications

### 5.1 `/` – Home page

**Purpose:** Minimal landing page with full-window hero artwork and hidden sidebar.

**Design:**

* Background: a single artwork image that fills the viewport (cover).

  * Use `<Image>` with `fill` layout and `object-cover`.
* Foreground overlay:

  * In the top left corner: menu icon (three lines) followed by artist’s name.
  * Clicking either:

    * Toggles the sidebar open/closed (on this page only). Menu icon and artist name should slide to the right with the opening of the sidebar (i.e. the sidebar should not cover them when opened).
* When sidebar is open:

  * Content dims slightly in the background (optional overlay).
  * Sidebar slides in from left.

**Data:**

* The homepage hero artwork should be:

  * A randomly selected artwork from Supabase (server-side fetch).

**Implementation notes:**

* This page can be a **server component** that fetches the hero artwork, if dynamic.
* Sidebar open/close is purely **client state** (e.g., `useState` in a client wrapper).
* Must be fully responsive:

* Ensure name/menu are readable over background (add gradient overlay or text shadow).

---

### 5.2 `/about` – About page

**Purpose:** Display artist bio and an image of the artist.

**Design:**

* Layout: two columns on desktop, stacked on mobile.

  * Left: image of the artist.
  * Right: bio text.
* Sidebar:

  * Always visible on desktop.
* Styling: minimal, lots of white space, readable type.

**Data:**

* Fetch `bio` from Supabase:

  * Single row from `bio` table.
* Fetch artist photo:

  * A static `public/artist.jpg`.

**Implementation notes:**

* `/about/page.tsx` as a **server component**:

  * Uses Supabase server client to fetch `bio`.
  * Define a `revalidate` interval (e.g., `export const revalidate = 60;`) or use on-demand revalidation.
* CSS:

  * On small screens: `flex-col`.
  * On larger screens: `flex-row` with a `gap-` spacing.

---

### 5.3 `/artworks` – Artworks page

**Purpose:** Display all artworks with optional filtering by medium.

**Design:**

* Sidebar:

  * Always visible.
  * `Artworks` item is highlighted.
  * Sub-items visible: `Paintings`, `Works on Paper`, `Sculpture`.
* Main content:

  * Title (optional) and filters summary.
  * Responsive grid of artwork cards:

    * Thumbnail image.
    * Hovering on a card should display "Title, Year" over the image thumbnail.

  * Clicking on a card should:

    * Navigate to `/artworks/[id]`.
    * This should display larger image with the Title, Year, Medium, Dimensions, and Details displayed on the side.
    * Clicking the larger image should open a modal for zooming in and dragging around on the image for inspection.

**Filtering behavior:**

* Base `/artworks` shows **all artworks** (no filter).
* Clicking sidebar sub-items:

  * Changes selected medium (e.g. `?medium=Painting` in URL query).
  * The page then filters artworks to that medium only.
* Implementation:

  * Option 1 (simpler): fetch **all artworks** server-side and filter **client-side**.
  * Option 2: change query param and re-fetch on medium change via server.

Given this is low traffic & small dataset, **Option 1** is fine.

**Data:**

* Query `artworks` table:

  * Order by `year`.
* Fields displayed per card (upon clicking it):

  * Image (thumbnail via Next `<Image>`).
  * Title.
  * Year.
  * Medium.
  * Details
  * Dimensions (height x width for Paintings or Works on Paper, width x height x length for Sculptures).

**Implementation notes:**

* `ArtworksGrid` is a reusable client component that:

  * Accepts `artworks` (array).
  * Accepts `filterMedium` (optional).
  * Handles layout and click interactions.
* Add `export const revalidate = 60;` or use on-demand if artworks are updated infrequently.

---

### 5.4 `/admin` – Admin CMS

The admin area will consist of:

* `/admin/login`: Login page.
* `/admin`: Auth-guarded dashboard.

#### 5.4.1 Auth flow

* `/admin/login`:

  * Uses `@supabase/auth-ui-react` to render login form (email/password).
  * On successful login, redirect to `/admin`.
* `/admin`:

  * **Protected**:

    * On server: use `createServerComponentClient` from `@supabase/auth-helpers-nextjs` in `admin/layout.tsx`.
    * If no session:

      * Redirect to `/admin/login`.
    * If session:

      * Render dashboard.

#### 5.4.2 `/admin` layout

* Consistent admin shell:

  * Top bar with:

    * Page title (“Admin”).
    * Logged-in email (optional).
    * Logout button (calls `supabase.auth.signOut()` and redirects to `/admin/login`).
* Main area:

  * Section 1: Artworks table + upload button.
  * Section 2: Bio editor.

##### Section 1: Artworks table

**Requirements:**

* Table of all artworks:

  * Columns: image (a link that when clicked opens a new tab with the image of the artwork), title, year, medium, details, height, width, length, created_at, updated_at, actions.
* Actions:

  * **Edit** (opens ArtworkForm pre-filled).
  * **Delete** (opens ConfirmDialog).
* “Upload Artwork” button:

  * Opens ArtworkForm in “create” mode.

**`ArtworkForm` fields:**

* Image upload (file input):

  * Required for new artwork.
  * Optional when editing (preserve existing image if none selected).
* Title (text, required).
* Year (number, required).
* Medium (select: Painting / Work on Paper / Sculpture).
* Details (text, optional).
* Height (number).
* Width (number).
* Length (number, shown only if medium is “Sculpture”).

Units for height, width, length are inches.

**Validation:**

* Use `react-hook-form` + `zod`:

  * Title: non-empty.
  * Year: 2000 - current year
  * Dimensions: positive numbers.
  * Length required iff medium == Sculpture.

**Create flow:**

1. Submit form.
2. Upload image to Supabase Storage (`artworks` bucket).
3. Get public URL.
4. Insert row into `artworks` table with `image_url`.
5. Optionally trigger revalidation for `/`/`/about`/`/artworks` (via `app/api/revalidate` endpoint).

**Edit flow:**

* Fetch row data into form.
* If user uploads a new image:

  * Upload new image, get URL, update row.
* If not:

  * Keep `image_url` unchanged.
* Update `updated_at`.

**Delete flow:**

* Confirm dialog.
* Delete row via Supabase.
* Optional: delete image from storage as well.

**Implementation details:**

* Artworks table & form will be **client components**.
* They can use Supabase client (`lib/supabase/client.ts`) directly:

  * RLS ensures only the logged-in artist can modify data.

##### Section 2: Bio editor

**Requirements:**

* Show current bio content in a large textarea.
* Display “Last updated: <formatted date>”.
* Provide “Save” button.

**Flow:**

1. On mount:

   * Fetch `bio` row (server side in parent, pass down as props to client).
2. User edits text.
3. On save:

   * Update `bio.content` and `bio.updated_at`.
   * Optimistically update UI.
   * Trigger revalidation for `/about` (and others if they also show bio).

**Implementation notes:**

* Simple `textarea` is sufficient for “minimal about page”.

---

## 6. Rendering & data fetching strategy

### Public pages (`/`, `/about`, `/artworks`)

* Use **server components** with Supabase server client.
* Caching:

  * `export const revalidate = 60;` or similar for light ISR.
  * Or use on-demand revalidation via a small `/api/revalidate` endpoint that the admin UI calls on content changes.
* Public read:

  * `anon` key used on server side for reads; RLS allows select.

### Admin pages (`/admin`, `/admin/login`)

* Mostly **client components** for interactive UI.
* Auth:

  * `admin/layout.tsx` is a **server component** that enforces authentication.
* Data:

  * For list views (artworks, bio), fetch may be done server-side in `admin/page.tsx` and passed to client components as props.
  * Mutations (create/update/delete) done client-side via Supabase client or through internal API routes.

---

## 7. Responsive & UX considerations

* **Mobile first**:

  * Sidebar:

    * On small screens, treat it as an overlay/drawer.
    * On home page, overlay toggled by tapping artist name or menu icon.
    * On `/about` and `/artworks`, allow collapse with a smaller breakpoint-specific behavior.
  * About page:

    * Stack image above bio on mobile (`flex-col`).
  * Artworks grid:

    * 1 column on very small screens.
    * 2–3 columns on tablets.
    * 3–4+ columns on desktop.

* **Images**:

  * Use Next `<Image>` with remote domains configured in `next.config.mjs` for Supabase Storage URLs.
  * Use `placeholder="blur"` with low-res placeholder (optional).

* **Accessibility**:

  * Ensure menu icon is a `<button>` with `aria-label="Toggle menu"`.
  * Use `alt` text for all images (artworks, artist).
  * Proper focus trapping in sidebar on mobile (nice-to-have).

* **Performance**:

  * Avoid loading full-resolution images in the grid (use smaller sizes in `<Image>`). Ensure full image resolution when inspecting the artwork card.
  * Consider pagination or lazy-loading if artworks list gets large (future enhancement).
