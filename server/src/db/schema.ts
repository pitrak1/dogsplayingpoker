import { integer, pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  chips: integer('chips').notNull().default(1000),
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('users_deleted_at_idx').on(table.deletedAt),
  index('users_created_at_idx').on(table.createdAt)
])
