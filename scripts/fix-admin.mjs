import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Manually parse .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ADMIN_EMAILS = ['admin@shobha.in', 'admin@cashobha.in']
const ADMIN_PASSWORD = '11111111'

async function fixAdmin() {
  for (const email of ADMIN_EMAILS) {
    console.log(`\nSetting up admin user: ${email}...`)

    // 1. Try to find the user in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('Error listing users:', listError.message)
      continue;
    }

    let user = users.find(u => u.email === email)

    if (!user) {
      console.log('User not found in Auth. Creating...')
      const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'Admin User' }
      })

      if (createError) {
        console.error('Error creating user:', createError.message)
        continue;
      }
      user = newUser
      console.log('User created successfully.')
    } else {
      console.log('User exists in Auth. Updating password...')
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: ADMIN_PASSWORD
      })
      if (updateError) {
        console.error('Error updating password:', updateError.message)
      } else {
        console.log('Password updated successfully.')
      }
    }

    // 2. Ensure profile exists and has admin role
    console.log(`Ensuring profile for ${user.id} has 'admin' role...`)
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: email,
        full_name: 'Admin User',
        role: 'admin'
      }, { onConflict: 'id' })

    if (upsertError) {
      console.error('Error updating profile:', upsertError.message)
    } else {
      console.log(`Admin profile setup complete for ${email}. Role set to "admin".`)
    }
  }
}

fixAdmin().catch(console.error)
