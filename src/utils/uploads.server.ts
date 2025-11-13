import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// Save uploaded file
export async function saveUploadedFile(
  file: File,
  userId: string
): Promise<string> {
  await ensureUploadDir()

  // Generate unique filename
  const ext = path.extname(file.name)
  const filename = `${userId}-${nanoid()}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  // Convert File to Buffer and save
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)

  // Return public URL
  return `/uploads/${filename}`
}

// Delete uploaded file
export async function deleteUploadedFile(url: string): Promise<void> {
  try {
    const filename = path.basename(url)
    const filepath = path.join(UPLOAD_DIR, filename)
    await fs.unlink(filepath)
  } catch (error) {
    console.error('Failed to delete file:', error)
  }
}

// Validate file type
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ]

  return allowedTypes.includes(file.type)
}

// Validate file size (max 50MB)
export function validateFileSize(file: File): boolean {
  const maxSize = 50 * 1024 * 1024 // 50MB
  return file.size <= maxSize
}
