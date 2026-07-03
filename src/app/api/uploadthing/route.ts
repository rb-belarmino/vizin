import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/infrastructure/storage/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
