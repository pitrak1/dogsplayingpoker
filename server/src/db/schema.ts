import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  chips: integer('chips').notNull().default(1000),
})
