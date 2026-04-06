import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, serviceRoleKey!)

async function checkData() {
  const { data: inq } = await supabase.from('contact_inquiries').select('*')
  const { data: book } = await supabase.from('bookings').select('*')
  
  console.log(`Inquiries: ${inq?.length || 0}`)
  console.log(`Bookings: ${book?.length || 0}`)
}

checkData()
