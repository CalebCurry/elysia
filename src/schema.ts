import { pgTable, serial, text, date, timestamp } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  campaignId: serial().primaryKey(),
  name: text().notNull(),
  dueDate: date(),
  createdAt: timestamp().notNull().defaultNow()
})