import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type } from "arktype";

/**
 * Database Schema Definition
 * 
 * Note on ArkType and Drizzle Integration:
 * We're intentionally keeping ArkType validation schemas separate from Drizzle schema
 * for several important reasons:
 * 
 * 1. Type System Conflicts:
 *    - There are known TypeScript conflicts when trying to integrate validation schemas
 *      with Drizzle's type system (see: github.com/drizzle-team/drizzle-orm/issues/3599)
 *    - These conflicts can cause protected property access issues and TypeScript errors
 * 
 * 2. Separation of Concerns:
 *    - Drizzle schema: Handles database structure and types
 *    - ArkType schema: Handles input validation separately
 *    - This separation makes it easier to modify validation rules without touching
 *      the database schema
 * 
 * 3. Better Maintainability:
 *    - Validation logic can be adjusted without database migrations
 *    - Clearer boundary between database constraints and application-level validation
 *    - More flexible validation rules that might not map 1:1 with database types
 * 
 * While Drizzle does offer ArkType integration, keeping them separate provides
 * better stability and maintainability for our use case.
 */

// Define the photos table schema
export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Define ArkType validation schema for the photo model
export const photoType = type({
  "url": "string",
  "title": "string",
  "description?": "string"
});

// Type for insert operations
export type Photo = typeof photoType.infer;

// Export database types
export type NewPhoto = typeof photos.$inferInsert;
export type PhotoSelect = typeof photos.$inferSelect;

// We'll use the ArkType schema directly in our routes instead of trying to 
// integrate it with Drizzle schema creation functions, which are causing type conflicts
