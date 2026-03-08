import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'

// Isso cria automaticamente os verbos GET e POST para uploads!
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter
})
