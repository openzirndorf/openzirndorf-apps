import type { Listing } from "@openzirndorf/garagen-flohmarkt-api";
import { desc, sql } from "drizzle-orm";
import type {
  CreateListingRecord,
  ListingRepository,
} from "../../ports/listing-repository";
import { createDatabaseClient } from "./client";
import { listingsTable } from "./schema";

function mapListingRowToModel(row: typeof listingsTable.$inferSelect): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    neighborhood: row.neighborhood,
    saleDate: row.saleDate,
  };
}

export function createDrizzleListingRepository(
  database: D1Database,
): ListingRepository {
  const db = createDatabaseClient(database);

  return {
    async list(filters) {
      const rows = filters?.neighborhood
        ? await db
            .select()
            .from(listingsTable)
            .where(
              sql`lower(${listingsTable.neighborhood}) like ${`%${filters.neighborhood.toLowerCase()}%`}`,
            )
            .orderBy(desc(listingsTable.createdAt))
        : await db
            .select()
            .from(listingsTable)
            .orderBy(desc(listingsTable.createdAt));

      return rows.map(mapListingRowToModel);
    },
    async create(record: CreateListingRecord) {
      await db.insert(listingsTable).values({
        id: record.id,
        title: record.title,
        description: record.description,
        neighborhood: record.neighborhood,
        saleDate: record.saleDate,
        createdAt: record.createdAt,
      });

      return {
        id: record.id,
        title: record.title,
        description: record.description,
        neighborhood: record.neighborhood,
        saleDate: record.saleDate,
      };
    },
  };
}
