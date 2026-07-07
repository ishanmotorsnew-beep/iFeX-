/**
 * Supabase PostgreSQL Client
 * Connects to Supabase for data persistence
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured');
  console.warn('Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log('✓ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('✗ Supabase connection failed:', error.message);
    return false;
  }
}
