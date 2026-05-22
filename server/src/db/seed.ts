import 'dotenv/config'
import bcrypt from 'bcrypt'
import { sql } from 'drizzle-orm'
import { db } from './index'
import { users, pets } from './schema'

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
  console.log('Done.')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
