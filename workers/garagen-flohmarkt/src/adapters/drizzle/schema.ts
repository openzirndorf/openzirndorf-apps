import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listingsTable = sqliteTable("listings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  neighborhood: text("neighborhood").notNull(),
  saleDate: text("sale_date").notNull(),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
});
