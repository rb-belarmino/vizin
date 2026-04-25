import "dotenv/config";
import { env } from "prisma/config";

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
};
