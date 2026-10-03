import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const snapshots = sqliteTable('snapshots', { key: text('key').primaryKey(), payload: text('payload').notNull(), updatedAt: text('updated_at').notNull() });
