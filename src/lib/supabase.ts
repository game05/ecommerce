import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvemqihlxektuddtnfsy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZW1xaWhseGVrdHVkZHRuZnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTY0ODgsImV4cCI6MjA0OTc3MjQ4OH0.6VQTcm9BMTRKo2RLo1C1Xe1la-znjMPFnzIUKDKGi9k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
