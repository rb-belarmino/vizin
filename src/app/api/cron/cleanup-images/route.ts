import { NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const utapi = new UTApi()

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized execution
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Get all valid image keys from the database
    const listings = await prisma.serviceListing.findMany({
      select: { portfolioImageKey: true },
      where: { portfolioImageKey: { not: '' } }
    })

    const validKeys = new Set(listings.map(l => l.portfolioImageKey))

    // 2. Fetch all files from UploadThing (Handling pagination if needed)
    // Note: UTApi listFiles is available in recent versions of uploadthing
    const { files } = await utapi.listFiles({})

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files found in UploadThing.' })
    }

    // 3. Find files that are in UploadThing but NOT in the database
    const orphanedFiles = files.filter(file => !validKeys.has(file.key))

    // 4. Delete orphaned files
    if (orphanedFiles.length > 0) {
      const keysToDelete = orphanedFiles.map(file => file.key)
      await utapi.deleteFiles(keysToDelete)
      console.log(`Cron: Deleted ${keysToDelete.length} orphaned files.`)

      return NextResponse.json({
        message: `Cleanup successful. Deleted ${keysToDelete.length} orphaned files.`,
        deletedKeys: keysToDelete
      })
    }

    return NextResponse.json({
      message: 'No orphaned files found. Storage is clean.'
    })
  } catch (error) {
    console.error('Error during cron cleanup:', error)
    return NextResponse.json(
      { error: 'Internal Server Error during cleanup' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
