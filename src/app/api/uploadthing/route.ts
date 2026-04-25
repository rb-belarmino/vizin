import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Expõe os endpoints do UploadThing para o frontend
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
