import { execSync } from 'node:child_process'

export default async function () {
  try {
    execSync('docker compose -f docker-compose.test.yml up -d', { stdio: 'inherit' })
    // Wait for the DB to accept connections
    await new Promise((resolve) => setTimeout(resolve, 2000))
    execSync('pnpm test:db:push', { stdio: 'inherit' })
  } catch (e) {
    console.error('Failed to start test DB:', e)
    throw e
  }
}