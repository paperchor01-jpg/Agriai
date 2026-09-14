import { testSupabaseConnection } from '../lib/supabase/test-connection';

async function main() {
  console.log('====================================================');
  console.log('  AGRIAI (SIH25010) — SUPABASE CONNECTION TEST');
  console.log('====================================================\n');

  const result = await testSupabaseConnection();

  console.log('Configured in environment:', result.configured ? 'YES' : 'NO');
  console.log('Connected to database:    ', result.connected ? 'YES' : 'NO');
  console.log('\nStatus Message:');
  console.log(result.message);

  if (result.details?.error) {
    console.log('\nDetails:');
    console.log(result.details.error);
  }

  if (result.details?.farmersTableAccessible) {
    console.log(`\nVerified accessible tables: farmers (count: ${result.details.farmerCount})`);
  }

  if (!result.configured) {
    console.log('\n----------------------------------------------------');
    console.log('HOW TO CONFIGURE SUPABASE:');
    console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Create a new project (or use an existing project).');
    console.log('3. Navigate to Project Settings -> API.');
    console.log('4. Copy the "Project URL" and the "anon public" API key.');
    console.log('5. Paste them into your .env.local file:');
    console.log('     NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co');
    console.log('     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('6. Copy the contents of supabase/schema.sql and run it in the Supabase SQL Editor.');
    console.log('----------------------------------------------------');
  }

  console.log('\n====================================================');
}

main().catch(console.error);
