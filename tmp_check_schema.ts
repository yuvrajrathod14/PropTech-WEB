import { createClient } from './lib/supabase/server'

async function checkSchema() {
  const supabase = createClient()
  const { data, error } = await supabase.from('bookings').select('*').limit(1)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Columns:', Object.keys(data[0] || {}))
  }
}

checkSchema()
