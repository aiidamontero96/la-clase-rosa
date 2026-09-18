import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Each browser has an opaque, HttpOnly notebook cookie. No pupil records.
export const notebooks = sqliteTable('pdi_notebooks', {
  id: text('id').primaryKey(),
  data: text('data').notNull(),
  updatedAt: integer('updated_at').notNull()
});
