import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  pgEnum,
  geometry,
} from 'drizzle-orm/pg-core'

export const reactivityEnum = pgEnum('reactivity', ['strong', 'mixed', 'none', 'unknown'])
export const sizeEnum = pgEnum('size', ['giant', 'large', 'medium', 'small', 'toy', 'unknown'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  profileImageUrl: text('profile_image_url'),
  location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }),
  radiusMiles: integer('radius_miles'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('users_deleted_at_idx').on(table.deletedAt),
  index('users_created_at_idx').on(table.createdAt)
])

export const pets = pgTable('pets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  size: sizeEnum('size').notNull().default('unknown'),
  breed: text('breed').notNull(),
  pictureUrl: text('picture_url'),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  dogReactivity: reactivityEnum('dog_reactivity').notNull().default('unknown'),
  dogReactivityNotes: text('dog_reactivity_notes'),
  catReactivity: reactivityEnum('cat_reactivity').notNull().default('unknown'),
  catReactivityNotes: text('cat_reactivity_notes'),
  kidReactivity: reactivityEnum('kid_reactivity').notNull().default('unknown'),
  kidReactivityNotes: text('kid_reactivity_notes'),
  peopleReactivity: reactivityEnum('people_reactivity').notNull().default('unknown'),
  peopleReactivityNotes: text('people_reactivity_notes'),
})
