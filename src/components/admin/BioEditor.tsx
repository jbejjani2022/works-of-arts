'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { updateBio } from '@/lib/supabase/queries'
import type { Bio } from '@/lib/types'
import { format } from 'date-fns'

interface BioEditorProps {
  bio: Bio
  onUpdate: () => void
}

export function BioEditor({ bio, onUpdate }: BioEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const supabase = createClient()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content: bio.content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-3 py-2',
      },
    },
  })

  const handleSave = useCallback(async () => {
    if (!editor) return

    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const html = editor.getHTML()
      await updateBio(supabase, bio.id, { content: html })
      setSuccessMessage('Bio saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      onUpdate()
    } catch (error) {
      console.error('Failed to save bio:', error)
      setErrorMessage('Failed to save bio. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }, [editor, supabase, bio.id, onUpdate])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-medium">Bio Editor</h3>

      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap gap-1 rounded border border-gray-300 bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`rounded px-3 py-1 text-sm font-semibold transition-colors ${
            editor.isActive('bold')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          title="Bold"
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`rounded px-3 py-1 text-sm italic transition-colors ${
            editor.isActive('italic')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          title="Italic"
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`rounded px-3 py-1 text-sm underline transition-colors ${
            editor.isActive('underline')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          title="Underline"
        >
          U
        </button>

        <div className="mx-1 w-px bg-gray-300" />

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Heading 2"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Heading 3"
        >
          H3
        </button>

        <div className="mx-1 w-px bg-gray-300" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Bullet List"
        >
          •
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Numbered List"
        >
          1.
        </button>

        <div className="mx-1 w-px bg-gray-300" />

        <button
          onClick={setLink}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            editor.isActive('link')
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
          type="button"
          title="Add Link"
        >
          Link
        </button>

        {editor.isActive('link') && (
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200"
            type="button"
            title="Remove Link"
          >
            Unlink
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-md border border-gray-300 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Last updated timestamp */}
      <p className="mt-4 text-sm text-gray-600">
        Last updated:{' '}
        {bio.updated_at ? format(new Date(bio.updated_at), 'PPpp') : 'Never'}
      </p>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? 'Saving...' : 'Save Bio'}
        </Button>
      </div>
    </div>
  )
}
