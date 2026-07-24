import 'dotenv/config'
import bcrypt from 'bcrypt'
import { sql } from 'drizzle-orm'
import { db } from './index'
import { users, pets, chatInvites, chats, chatMemberships, messages, userBlocks } from './schema'

const avatar = (name: string, bg: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128`

const seedUsers = [
  { username: 'sarah_k',  email: 'sarah@example.com',  fullName: 'Sarah K',  bg: 'e8a87c', lat: 41.8781, lng: -87.6298, radius: 3 },  // Loop
  { username: 'mike_r',   email: 'mike@example.com',   fullName: 'Mike R',   bg: '85c1e9', lat: 41.9214, lng: -87.6513, radius: 5 },  // Lincoln Park
  { username: 'jen_t',    email: 'jen@example.com',    fullName: 'Jen T',    bg: '82e0aa', lat: 41.9088, lng: -87.6796, radius: 2 },  // Wicker Park
  { username: 'carlos_m', email: 'carlos@example.com', fullName: 'Carlos M', bg: 'bb8fce', lat: 41.7943, lng: -87.5907, radius: 4 },  // Hyde Park
  { username: 'amy_w',    email: 'amy@example.com',    fullName: 'Amy W',    bg: 'f1948a', lat: 41.9484, lng: -87.6553, radius: 3 },  // Wrigleyville
  { username: 'derek_p',  email: 'derek@example.com',  fullName: 'Derek P',  bg: 'f7dc6f', lat: 41.9237, lng: -87.7095, radius: 6 },  // Logan Square
  { username: 'priya_n',  email: 'priya@example.com',  fullName: 'Priya N',  bg: '76d7c4', lat: 41.8625, lng: -87.6225, radius: 2 },  // South Loop
  { username: 'tom_h',    email: 'tom@example.com',    fullName: 'Tom H',    bg: 'd7bde2', lat: 41.8388, lng: -87.6531, radius: 4 },  // Bridgeport
  { username: 'rachel_b', email: 'rachel@example.com', fullName: 'Rachel B', bg: 'f5b041', lat: 41.9697, lng: -87.6809, radius: 5 },  // Ravenswood
  { username: 'jake_d',   email: 'jake@example.com',   fullName: 'Jake D',   bg: 'aab7b8', lat: 41.8559, lng: -87.6492, radius: 3 },  // Pilsen
  { username: 'maria_g',  email: 'maria@example.com',  fullName: 'Maria G',  bg: 'ec7063', lat: 41.8907, lng: -87.6280, radius: 2 },  // River North
  { username: 'kevin_s',  email: 'kevin@example.com',  fullName: 'Kevin S',  bg: '5dade2', lat: 41.9700, lng: -87.7036, radius: 4 },  // Albany Park
  { username: 'lisa_o',   email: 'lisa@example.com',   fullName: 'Lisa O',   bg: 'a569bd', lat: 41.7505, lng: -87.6584, radius: 5 },  // Beverly
  { username: 'nate_f',   email: 'nate@example.com',   fullName: 'Nate F',   bg: '48c9b0', lat: 41.9295, lng: -87.6883, radius: 3 },  // Bucktown
  { username: 'olivia_r', email: 'olivia@example.com', fullName: 'Olivia R', bg: 'f8c471', lat: 41.8400, lng: -87.6800, radius: 4 },  // McKinley Park
  { username: 'paul_c',   email: 'paul@example.com',   fullName: 'Paul C',   bg: 'cd6155', lat: 41.9445, lng: -87.6500, radius: 2 },  // Lakeview
  { username: 'quinn_a',  email: 'quinn@example.com',  fullName: 'Quinn A',  bg: '7fb3d5', lat: 41.7800, lng: -87.5950, radius: 6 },  // Woodlawn
  { username: 'ravi_m',   email: 'ravi@example.com',   fullName: 'Ravi M',   bg: 'af7ac5', lat: 41.9100, lng: -87.6200, radius: 3 },  // Streeterville
  { username: 'sofia_j',  email: 'sofia@example.com',  fullName: 'Sofia J',  bg: '58d68d', lat: 41.9580, lng: -87.6660, radius: 5 },  // Uptown
  { username: 'tyler_p',  email: 'tyler@example.com',  fullName: 'Tyler P',  bg: 'f1c40f', lat: 41.8120, lng: -87.6600, radius: 4 },  // Back of the Yards
  { username: 'uma_b',    email: 'uma@example.com',    fullName: 'Uma B',    bg: 'e74c3c', lat: 41.9930, lng: -87.6720, radius: 3 },  // Edgewater
  { username: 'victor_l', email: 'victor@example.com', fullName: 'Victor L', bg: '3498db', lat: 41.8830, lng: -87.6500, radius: 2 },  // West Loop
  { username: 'wendy_h',  email: 'wendy@example.com',  fullName: 'Wendy H',  bg: '9b59b6', lat: 41.9000, lng: -87.6920, radius: 5 },  // East Village
  { username: 'xavier_n', email: 'xavier@example.com', fullName: 'Xavier N', bg: '1abc9c', lat: 41.7700, lng: -87.6300, radius: 4 },  // Englewood
  { username: 'yara_e',   email: 'yara@example.com',   fullName: 'Yara E',   bg: 'e67e22', lat: 41.9398, lng: -87.7240, radius: 3 },  // Avondale
  { username: 'zach_v',   email: 'zach@example.com',   fullName: 'Zach V',   bg: 'c0392b', lat: 41.8470, lng: -87.6850, radius: 5 },  // Heart of Chicago
  { username: 'aisha_t',  email: 'aisha@example.com',  fullName: 'Aisha T',  bg: '2980b9', lat: 41.9610, lng: -87.6400, radius: 2 },  // Buena Park
  { username: 'brian_q',  email: 'brian@example.com',  fullName: 'Brian Q',  bg: '8e44ad', lat: 41.8260, lng: -87.6200, radius: 4 },  // Chinatown
  { username: 'cara_w',   email: 'cara@example.com',   fullName: 'Cara W',   bg: '16a085', lat: 41.9250, lng: -87.6755, radius: 3 },  // Noble Square
  { username: 'dylan_i',  email: 'dylan@example.com',  fullName: 'Dylan I',  bg: 'd35400', lat: 41.7900, lng: -87.6720, radius: 5 },  // Marquette Park
  { username: 'eva_u',    email: 'eva@example.com',    fullName: 'Eva U',    bg: 'd98880', lat: 41.9810, lng: -87.6685, radius: 4 },  // Andersonville
  { username: 'finn_k',   email: 'finn@example.com',   fullName: 'Finn K',   bg: '7dcea0', lat: 41.8600, lng: -87.6480, radius: 3 },  // University Village
  { username: 'gina_z',   email: 'gina@example.com',   fullName: 'Gina Z',   bg: 'f5b7b1', lat: 41.9500, lng: -87.6750, radius: 5 },  // North Center
  { username: 'henry_y',  email: 'henry@example.com',  fullName: 'Henry Y',  bg: 'aed6f1', lat: 41.7610, lng: -87.6710, radius: 4 },  // Auburn Gresham
  { username: 'isla_x',   email: 'isla@example.com',   fullName: 'Isla X',   bg: 'c39bd3', lat: 41.9020, lng: -87.6650, radius: 2 },  // Old Town
  { username: 'jamal_w',  email: 'jamal@example.com',  fullName: 'Jamal W',  bg: '76d7c4', lat: 41.7720, lng: -87.6090, radius: 6 },  // Greater Grand Crossing
  { username: 'kira_v',   email: 'kira@example.com',   fullName: 'Kira V',   bg: 'fad7a0', lat: 41.9430, lng: -87.6900, radius: 3 },  // Roscoe Village
  { username: 'leo_u',    email: 'leo@example.com',    fullName: 'Leo U',    bg: 'eb984e', lat: 41.8195, lng: -87.7095, radius: 4 },  // Brighton Park
  { username: 'mia_t',    email: 'mia@example.com',    fullName: 'Mia T',    bg: 'a3e4d7', lat: 41.9740, lng: -87.6925, radius: 5 },  // Lincoln Square
  { username: 'noah_s',   email: 'noah@example.com',   fullName: 'Noah S',   bg: 'f9e79f', lat: 41.8330, lng: -87.6280, radius: 3 },  // Armour Square
  { username: 'opal_r',   email: 'opal@example.com',   fullName: 'Opal R',   bg: 'd2b4de', lat: 41.9135, lng: -87.7100, radius: 4 },  // Hermosa
  { username: 'pete_q',   email: 'pete@example.com',   fullName: 'Pete Q',   bg: 'a9dfbf', lat: 41.8030, lng: -87.6310, radius: 5 },  // Fuller Park
  { username: 'quincy_p', email: 'quincy@example.com', fullName: 'Quincy P', bg: 'f5cba7', lat: 41.9165, lng: -87.6420, radius: 2 },  // Gold Coast
  { username: 'rosa_o',   email: 'rosa@example.com',   fullName: 'Rosa O',   bg: 'd5dbdb', lat: 41.7950, lng: -87.6440, radius: 4 },  // Washington Park
  { username: 'sean_n',   email: 'sean@example.com',   fullName: 'Sean N',   bg: 'ec7063', lat: 41.9085, lng: -87.6360, radius: 3 },  // Near North Side
  { username: 'tara_m',   email: 'tara@example.com',   fullName: 'Tara M',   bg: '5499c7', lat: 41.8730, lng: -87.6740, radius: 5 },  // Little Italy
  { username: 'uri_l',    email: 'uri@example.com',    fullName: 'Uri L',    bg: 'ba68c8', lat: 41.9870, lng: -87.6580, radius: 4 },  // Bowmanville
  { username: 'val_k',    email: 'val@example.com',    fullName: 'Val K',    bg: '4dd0e1', lat: 41.7840, lng: -87.6850, radius: 3 },  // West Lawn
  { username: 'wes_j',    email: 'wes@example.com',    fullName: 'Wes J',    bg: 'ffb74d', lat: 41.9265, lng: -87.6610, radius: 5 },  // West Town
  { username: 'xio_i',    email: 'xio@example.com',    fullName: 'Xio I',    bg: 'e57373', lat: 41.8475, lng: -87.6700, radius: 2 },  // Tri-Taylor
  { username: 'yuri_h',   email: 'yuri@example.com',   fullName: 'Yuri H',   bg: '9575cd', lat: 41.9900, lng: -87.6850, radius: 4 },  // West Ridge
  { username: 'nick_p',   email: 'pitrak1@gmail.com',  fullName: 'Nick P',   bg: '2ecc71', lat: 41.8781, lng: -87.6298, radius: 5 },  // Loop (main test account)
]

type Reactivity = 'strong' | 'mixed' | 'none' | 'unknown'
type Size = 'giant' | 'large' | 'medium' | 'small' | 'toy' | 'unknown'

type SeedPet = {
  ownerIdx: number
  name: string
  age: number
  size: Size
  breed: string
  dogReactivity: Reactivity
  catReactivity: Reactivity
  kidReactivity: Reactivity
  peopleReactivity: Reactivity
  dogReactivityNotes?: string
  catReactivityNotes?: string
  kidReactivityNotes?: string
  peopleReactivityNotes?: string
}

const seedPets: SeedPet[] = [
  // sarah_k — 1 pet
  { ownerIdx: 0, name: 'Biscuit', age: 4, size: 'medium', breed: 'Beagle',
    dogReactivity: 'none', catReactivity: 'unknown', kidReactivity: 'none', peopleReactivity: 'none' },

  // mike_r — 2 pets
  { ownerIdx: 1, name: 'Rex', age: 6, size: 'large', breed: 'Labrador',
    dogReactivity: 'none', catReactivity: 'mixed', kidReactivity: 'none', peopleReactivity: 'none',
    catReactivityNotes: 'Curious but careful around cats.' },
  { ownerIdx: 1, name: 'Luna', age: 2, size: 'small', breed: 'Dachshund',
    dogReactivity: 'mixed', catReactivity: 'none', kidReactivity: 'none', peopleReactivity: 'none',
    dogReactivityNotes: 'Fine with most dogs, wary of large breeds.' },

  // jen_t — 0 pets

  // carlos_m — 3 pets
  { ownerIdx: 3, name: 'Tank', age: 5, size: 'giant', breed: 'Great Dane',
    dogReactivity: 'none', catReactivity: 'none', kidReactivity: 'none', peopleReactivity: 'none' },
  { ownerIdx: 3, name: 'Pepper', age: 8, size: 'medium', breed: 'Border Collie',
    dogReactivity: 'mixed', catReactivity: 'unknown', kidReactivity: 'none', peopleReactivity: 'none',
    dogReactivityNotes: 'Herding instincts can be intense.' },
  { ownerIdx: 3, name: 'Mittens', age: 3, size: 'small', breed: 'Tabby Cat',
    dogReactivity: 'strong', catReactivity: 'none', kidReactivity: 'mixed', peopleReactivity: 'none',
    dogReactivityNotes: 'Hisses at any dog.', kidReactivityNotes: 'Tolerates older kids only.' },

  // amy_w — 1 pet
  { ownerIdx: 4, name: 'Daisy', age: 1, size: 'small', breed: 'French Bulldog',
    dogReactivity: 'none', catReactivity: 'none', kidReactivity: 'none', peopleReactivity: 'none' },

  // derek_p — 2 pets
  { ownerIdx: 5, name: 'Bear', age: 7, size: 'large', breed: 'Newfoundland',
    dogReactivity: 'none', catReactivity: 'none', kidReactivity: 'none', peopleReactivity: 'none' },
  { ownerIdx: 5, name: 'Olive', age: 4, size: 'medium', breed: 'Mixed',
    dogReactivity: 'mixed', catReactivity: 'unknown', kidReactivity: 'mixed', peopleReactivity: 'none',
    dogReactivityNotes: 'Selective with playmates.', kidReactivityNotes: 'Best with calm older children.' },

  // priya_n — 1 pet
  { ownerIdx: 6, name: 'Mochi', age: 2, size: 'toy', breed: 'Chihuahua',
    dogReactivity: 'mixed', catReactivity: 'none', kidReactivity: 'mixed', peopleReactivity: 'mixed',
    dogReactivityNotes: 'Barks at unfamiliar dogs.', peopleReactivityNotes: 'Warms up slowly to strangers.' },

  // tom_h — 0 pets

  // rachel_b — 2 pets
  { ownerIdx: 8, name: 'Cooper', age: 5, size: 'large', breed: 'Golden Retriever',
    dogReactivity: 'none', catReactivity: 'none', kidReactivity: 'none', peopleReactivity: 'none' },
  { ownerIdx: 8, name: 'Ziggy', age: 9, size: 'small', breed: 'Pug',
    dogReactivity: 'none', catReactivity: 'unknown', kidReactivity: 'none', peopleReactivity: 'none' },

  // jake_d — 1 pet
  { ownerIdx: 9, name: 'Stella', age: 3, size: 'medium', breed: 'Pit Bull Mix',
    dogReactivity: 'mixed', catReactivity: 'strong', kidReactivity: 'none', peopleReactivity: 'none',
    dogReactivityNotes: 'Best meeting on neutral ground first.', catReactivityNotes: 'Strong prey drive.' },
]

async function seed() {
  console.log('Seeding database...')

  if (process.env.NODE_ENV !== 'production') {
    await db.delete(userBlocks)
    await db.delete(messages)
    await db.delete(chatMemberships)
    await db.delete(chats)
    await db.delete(chatInvites)
    await db.delete(pets)
    await db.delete(users)
  }

  const hashed = await bcrypt.hash('password123', 12)

  const insertedUsers = await db.insert(users).values(
    seedUsers.map((u) => ({
      username: u.username,
      email: u.email,
      password: hashed,
      profileImageUrl: avatar(u.fullName, u.bg),
      location: sql`ST_MakePoint(${u.lng}, ${u.lat})`,
      radiusMiles: u.radius,
    }))
  ).returning()

  console.log(`Inserted ${insertedUsers.length} users.`)

  await db.insert(pets).values(
    seedPets.map((p) => ({
      name: p.name,
      age: p.age,
      size: p.size,
      breed: p.breed,
      ownerId: insertedUsers[p.ownerIdx].id,
      dogReactivity: p.dogReactivity,
      dogReactivityNotes: p.dogReactivityNotes ?? null,
      catReactivity: p.catReactivity,
      catReactivityNotes: p.catReactivityNotes ?? null,
      kidReactivity: p.kidReactivity,
      kidReactivityNotes: p.kidReactivityNotes ?? null,
      peopleReactivity: p.peopleReactivity,
      peopleReactivityNotes: p.peopleReactivityNotes ?? null,
    }))
  )

  console.log(`Inserted ${seedPets.length} pets.`)

  // nick_p (pitrak1@gmail.com) is the last inserted user
  const nickUser = insertedUsers[insertedUsers.length - 1]
  const now = new Date()
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // 15 invites FROM other users TO pitrak1@gmail.com
  const invitesToNick = [
    { senderIdx: 0,  message: "Hey! Want to set up a playdate for our pups?",          status: 'pending'  as const, expiredAt: sevenDays },
    { senderIdx: 1,  message: "Rex and Luna would love some new friends!",               status: 'pending'  as const, expiredAt: sevenDays },
    { senderIdx: 3,  message: "Tank is looking for big-dog buddies to romp with.",       status: 'accepted' as const, expiredAt: sevenDays },
    { senderIdx: 4,  message: "Daisy is super friendly, let's meet at the park!",        status: 'accepted' as const, expiredAt: sevenDays },
    { senderIdx: 5,  message: "Bear could use a chill walking partner.",                 status: 'pending'  as const, expiredAt: threeDays },
    { senderIdx: 6,  message: "Mochi needs socialization — want to try a meetup?",       status: 'declined' as const, expiredAt: oneDayAgo },
    { senderIdx: 8,  message: "Cooper is great with everyone, want to hang at the dog park?", status: 'pending' as const, expiredAt: sevenDays },
    { senderIdx: 9,  message: "Stella does best meeting on neutral ground — park?",      status: 'pending'  as const, expiredAt: threeDays },
    { senderIdx: 11, message: null,                                                       status: 'pending'  as const, expiredAt: sevenDays },
    { senderIdx: 13, message: "Saw you nearby — want to set up a walk together?",        status: 'accepted' as const, expiredAt: sevenDays },
    { senderIdx: 15, message: "Our dogs would be great together!",                        status: 'pending'  as const, expiredAt: sevenDays },
    { senderIdx: 17, message: "Looking for weekend park buddies, interested?",            status: 'pending'  as const, expiredAt: threeDays },
    { senderIdx: 19, message: null,                                                        status: 'declined' as const, expiredAt: oneDayAgo },
    { senderIdx: 21, message: "My dog is super chill, would love to meet yours!",         status: 'pending'  as const, expiredAt: sevenDays },
    { senderIdx: 23, message: "Morning walks near the lake — want to join?",              status: 'accepted' as const, expiredAt: sevenDays },
  ]

  // 15 invites FROM pitrak1@gmail.com TO other users
  const invitesFromNick = [
    { receiverIdx: 2,  message: "Hey, want to grab a dog-friendly coffee and walk?",     status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 7,  message: "Saw you're nearby — up for a playdate?",                 status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 10, message: "Our dogs look like they'd get along great!",              status: 'accepted' as const, expiredAt: sevenDays },
    { receiverIdx: 12, message: "Want to do a group walk this weekend?",                   status: 'accepted' as const, expiredAt: threeDays },
    { receiverIdx: 14, message: null,                                                       status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 16, message: "Interested in a puppy playdate at Humboldt Park?",        status: 'declined' as const, expiredAt: oneDayAgo },
    { receiverIdx: 18, message: "Your dog is adorable — want to meet up?",                 status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 20, message: "Looking for a morning walk buddy, interested?",           status: 'pending'  as const, expiredAt: threeDays },
    { receiverIdx: 22, message: null,                                                        status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 24, message: "Trying to find socialization buddies for my pup!",        status: 'accepted' as const, expiredAt: sevenDays },
    { receiverIdx: 26, message: "Want to grab a dog-friendly patio spot together?",        status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 28, message: "Sunday dog park run — want to join?",                     status: 'declined' as const, expiredAt: oneDayAgo },
    { receiverIdx: 30, message: null,                                                        status: 'pending'  as const, expiredAt: threeDays },
    { receiverIdx: 32, message: "Our schedules seem to overlap — let's walk together!",    status: 'pending'  as const, expiredAt: sevenDays },
    { receiverIdx: 34, message: "Friendly neighborhood walk crew forming — want in?",      status: 'accepted' as const, expiredAt: sevenDays },
  ]

  await db.insert(chatInvites).values([
    ...invitesToNick.map(i => ({
      senderId: insertedUsers[i.senderIdx].id,
      receiverId: nickUser.id,
      message: i.message,
      status: i.status,
      expiredAt: i.expiredAt,
    })),
    ...invitesFromNick.map(i => ({
      senderId: nickUser.id,
      receiverId: insertedUsers[i.receiverIdx].id,
      message: i.message,
      status: i.status,
      expiredAt: i.expiredAt,
    })),
  ])

  console.log(`Inserted ${invitesToNick.length + invitesFromNick.length} chat invites.`)
  console.log('Done.')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
