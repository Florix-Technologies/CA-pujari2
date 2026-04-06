/**
 * Seed Script: Create Test User and Register for All Webinars & NSE Programs
 * Run: node scripts/seed-test-user.mjs
 *
 * Safe to run multiple times — accounts for already-existing users.
 */

const BASE_URL = 'http://localhost:3000'

const TEST_USER = {
  email: 'testuser@shobha.in',
  password: 'Test@12345',
  full_name: 'Riya Sharma',
  phone: '9876543210'
}

async function step(label, fn) {
  process.stdout.write(`⏳  ${label}... `)
  try {
    const result = await fn()
    console.log(`✅`)
    return result
  } catch (err) {
    console.log(`❌  ${err.message}`)
    throw err
  }
}

function cleanPrice(priceStr) {
  if (!priceStr) return '0'
  // Remove ₹, commas, spaces, dots
  const cleaned = String(priceStr).replace(/[₹,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? '0' : String(num)
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  CA-Pujari · Test User Seeder')
  console.log('═══════════════════════════════════════════════════\n')

  // ─── 1. Create the test user (or retrieve existing) ──────────────────────
  let userId = null
  await step(`Creating user "${TEST_USER.email}"`, async () => {
    const res = await fetch(`${BASE_URL}/api/admin-create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
        full_name: TEST_USER.full_name
      })
    })
    const data = await res.json()

    if (data.user?.id) {
      userId = data.user.id
      return `id=${userId}`
    }

    // If user already exists, fetch their ID from bookings
    if (data.error && (data.error.toLowerCase().includes('already') || data.error.toLowerCase().includes('exist'))) {
      process.stdout.write('(already exists, fetching id...) ')
      // Attempt to fetch their real id from existing bookings
      const bRes = await fetch(`${BASE_URL}/api/admin/bookings`)
      const bData = await bRes.json()
      const bookings = Array.isArray(bData) ? bData : (bData.data || [])
      const existing = bookings.find(b => b.email === TEST_USER.email)
      if (existing?.user_id) {
        userId = existing.user_id
        return `id=${userId}`
      }
      // No booking found — generate a stable fake UUID from email for seeding purposes
      userId = '00000000-test-user-0000-riyasharmatest'
      return `using fallback id`
    }

    throw new Error(data.error || JSON.stringify(data))
  })

  if (!userId) {
    userId = '00000000-test-user-0000-riyasharmatest'
    console.log(`  ⚠️  Could not determine user ID, using fallback: ${userId}`)
  }

  // ─── 2. Fetch all webinars / services ─────────────────────────────────────
  const webinars = await step('Fetching webinar/service offerings', async () => {
    const res = await fetch(`${BASE_URL}/api/webinars`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.data || [])
    return list
  })
  console.log(`   → Found ${webinars.length} service(s)`)

  // ─── 3. Fetch all NSE programs ────────────────────────────────────────────
  const nsePrograms = await step('Fetching NSE investment programs', async () => {
    const res = await fetch(`${BASE_URL}/api/nse`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.data || [])
    return list
  })
  console.log(`   → Found ${nsePrograms.length} program(s)`)

  // ─── 4. Book every webinar/service ───────────────────────────────────────
  console.log('\n📋  Booking Webinar / Consultation Services:\n')
  let wSuccess = 0, wFail = 0
  for (const w of webinars) {
    try {
      await step(`  "${w.title}"`, async () => {
        const body = {
          userId,
          name: TEST_USER.full_name,
          email: TEST_USER.email,
          phone: TEST_USER.phone,
          webinar_title: w.title,
          webinar_date: '2026-05-01',
          webinar_time: '06:00 PM',
          amount: cleanPrice(w.price),
          duration: `${w.duration_minutes || 60} minutes`
        }
        const res = await fetch(`${BASE_URL}/api/webinars/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.details || data.error || JSON.stringify(data))
      })
      wSuccess++
    } catch { wFail++ }
  }

  // ─── 5. Enroll in every NSE program ──────────────────────────────────────
  console.log('\n📋  Enrolling in NSE Investment Programs:\n')
  let nSuccess = 0, nFail = 0
  for (const p of nsePrograms) {
    try {
      await step(`  "${p.title}" (${p.price})`, async () => {
        const body = {
          userId,
          name: TEST_USER.full_name,
          email: TEST_USER.email,
          phone: TEST_USER.phone,
          webinar_title: p.title,
          amount: cleanPrice(p.price),
          section: p.category || 'foundational'
        }
        const res = await fetch(`${BASE_URL}/api/nse/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.details || data.error || JSON.stringify(data))
      })
      nSuccess++
    } catch { nFail++ }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  Results')
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Webinar bookings : ${wSuccess} ✅  ${wFail > 0 ? wFail + ' ❌' : ''}`)
  console.log(`  NSE enrollments  : ${nSuccess} ✅  ${nFail > 0 ? nFail + ' ❌' : ''}`)
  console.log('\n  Test User Credentials:')
  console.log(`    Email   : ${TEST_USER.email}`)
  console.log(`    Password: ${TEST_USER.password}`)
  console.log(`    Name    : ${TEST_USER.full_name}`)
  console.log('\n  ➜  Log in at: http://localhost:3000/login')
  console.log('  ➜  View all bookings in Admin → Leads & Bookings tab')
  console.log('═══════════════════════════════════════════════════\n')
}

main().catch(err => {
  console.error('\n💥  Fatal error:', err.message)
  process.exit(1)
})
