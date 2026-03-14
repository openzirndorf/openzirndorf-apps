import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/adapters/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
