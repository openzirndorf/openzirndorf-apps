import { drizzle } from "drizzle-orm/d1";

export function createDatabaseClient(database: D1Database) {
  return drizzle(database);
}
