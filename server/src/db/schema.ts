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
import { relations, getTableColumns } from 'drizzle-orm'
import { publicUserSchema } from 'dogsplayingpoker-shared/user'

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
export type PetRow = typeof pets.$inferSelect
export type NewPetRow = typeof pets.$inferInsert
export type ChatRow = typeof chats.$inferSelect
export type NewChatRow = typeof chats.$inferInsert
export type ChatMembershipRow = typeof chatMemberships.$inferSelect
export type NewChatMembershipRow = typeof chatMemberships.$inferInsert
export type MessageRow = typeof messages.$inferSelect
export type NewMessageRow = typeof messages.$inferInsert
export type ChatInviteRow = typeof chatInvites.$inferSelect
export type NewChatInviteRow = typeof chatInvites.$inferInsert
export type UserBlockRow = typeof userBlocks.$inferSelect
export type NewUserBlockRow = typeof userBlocks.$inferInsert

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

// This just strips out the password column which is only needed for the login endpoint
const { password: _password, ...userColumns } = getTableColumns(users)
export const safeUserColumns = userColumns
export type SafeUserRow = Omit<UserRow, 'password'>

const pickColumns = <T extends Record<string, unknown>, K extends keyof T>(
  cols: T,
  keys: readonly K[],
): Pick<T, K> =>
  Object.fromEntries(keys.map((k) => [k, cols[k]])) as Pick<T, K>

// This is a restricted form of user that is only showed when the user is not authenticated
export const publicUserColumns = pickColumns(
  getTableColumns(users),
  publicUserSchema.keyof().options,
)

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('pets_deleted_at_idx').on(table.deletedAt)
])

export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  chatMemberships: many(chats),
}))

export const petsRelations = relations(pets, ({ one }) => ({
  owner: one(users, {
    fields: [pets.ownerId],
    references: [users.id],
  }),
}))

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  hostId: integer('host_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('chats_updated_at_idx').on(table.updatedAt),
  index('chats_deleted_at_idx').on(table.deletedAt)
])

export const chatsRelations = relations(chats, ({ many }) => ({
  users: many(users)
}))

export const chatMemberships = pgTable('chat_memberships', {
  userId: integer('user_id').references(() => users.id).notNull(),
  chatId: integer('chat_id').references(() => chats.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('chat_memberships_created_at_idx').on(table.createdAt),
  index('chat_memberships_deleted_at_idx').on(table.deletedAt)
])

export const chatMembershipsRelations = relations(chatMemberships, ({ one }) => ({
  user: one(users, {
    fields: [chatMemberships.userId],
    references: [users.id]
  }),
  chat: one(chats, {
    fields: [chatMemberships.chatId],
    references: [chats.id],
  })
}))

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  chatId: integer('chat_id').references(() => chats.id).notNull(),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('messages_created_at_idx').on(table.createdAt),
  index('messages_deleted_at_idx').on(table.deletedAt)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.createdBy],
    references: [users.id]
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  })
}))

export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'declined'])

export const chatInvites = pgTable('chat_invites', {
  id: serial('id').primaryKey(),
  message: text('message'),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  status: inviteStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiredAt: timestamp('expired_at').notNull(),
}, (table) => [
  index('chat_invites_status_idx').on(table.status),
  index('chat_invites_created_at_idx').on(table.createdAt),
  index('chat_invites_expired_at_idx').on(table.expiredAt)
])

export const chatInvitesRelations = relations(chatInvites, ({ one }) => ({
  sender: one(users, {
    fields: [chatInvites.senderId],
    references: [users.id]
  }),
  receiver: one(users, {
    fields: [chatInvites.receiverId],
    references: [users.id]
  }),
}))

export const userBlocks = pgTable('user_blocks', {
  blockerId: integer('blocker_id').references(() => users.id).notNull(),
  blockedId: integer('blocked_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('user_blocks_deleted_at_idx').on(table.deletedAt)
])

export const userBlocksRelations = relations(userBlocks, ({ one }) => ({
  blocker: one(users, {
    fields: [userBlocks.blockerId],
    references: [users.id]
  }),
  blocked: one(users, {
    fields: [userBlocks.blockedId],
    references: [users.id]
  }),
}))