#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://mxboigeahudnbigxgefp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ym9pZ2VhaHVkbmJpZ3hnZWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMDU5OSwiZXhwIjoyMDg2NTg2NTk5fQ.h9UfQD9Oq85m_LV0pLQvtqhrmOBhIuwlnsa02dIwKK0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🚀 Deploying Battery Storage to Supabase with Service Role Key\n');

// Read migration SQL and extract CREATE TABLE statement
const migrationSQL = readFileSync('./supabase/migrations/003_battery_storage.sql', 'utf8');

// Try to fetch from table to see if it exists
console.log('🔍 Checking if table exists...');

const { data: testData, error: testError } = await supabase
  .from('battery_storage')
  .select('id')
  .limit(1);

if (testError && testError.message.includes('does not exist')) {
  console.log('❌ Table does not exist!\n');
  console.log('📋 Creating table via SQL API...\n');

  // Extract just the CREATE TABLE portion
  const createTableSQL = migrationSQL.split('INSERT INTO')[0];

  // Try to execute via POST to database endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: createTableSQL })
    });

    console.log('Response:', response.status);

    if (!response.ok) {
      console.log('\n⚠️  Cannot execute DDL via REST API');
      console.log('\n📝 You need to run the CREATE TABLE statements manually:');
      console.log('   1. Open: https://supabase.com/dashboard/project/mxboigeahudnbigxgefp/sql');
      console.log('   2. Copy the SQL from: supabase/migrations/003_battery_storage.sql');
      console.log('   3. Paste and run just the CREATE TABLE, INDEX, and POLICY sections');
      console.log('   4. Then run this script again to insert the data\n');
      process.exit(1);
    }
  } catch (err) {
    console.error('Cannot create table programmatically.');
    console.log('\n📝 Please run the CREATE TABLE statements in Supabase dashboard first.\n');
    process.exit(1);
  }
}

console.log('✅ Table exists!\n');

// Now insert all 20 storage systems
console.log('📦 Preparing to insert 20 storage systems...\n');

// Extract INSERT statements from migration and parse them
// Or use direct data (which is cleaner)

const insertSQL = migrationSQL.match(/INSERT INTO battery_storage[\s\S]*?;/g);

if (insertSQL) {
  console.log(`Found ${insertSQL.length} INSERT statements\n`);

  // Parse the INSERT VALUES and convert to JSON objects
  // This is complex, so let's use the direct data approach instead
}

// Read the complete data from the migration file
const migrationData = migrationSQL.match(/VALUES\s*\(([\s\S]*?)\);/g);

console.log('🔄 Inserting data using Supabase client...\n');

// Since parsing SQL is complex, let's just re-execute the INSERT portion via raw query
const insertStatements = migrationSQL.split('-- ')[0].split('INSERT INTO battery_storage')[1];

if (!insertStatements) {
  console.error('Could not extract INSERT data from migration');
  process.exit(1);
}

// Cleaner approach: Use the data array directly
const { data, error } = await supabase.rpc('exec_sql', {
  sql: 'INSERT INTO battery_storage ' + insertStatements
});

if (error) {
  console.log('⚠️  RPC execution failed, using direct client insert...\n');

  // Fall back to using direct Supabase client with parsed data
  // Since this is complex, let's provide the manual instructions
  console.log('📋 Please run the INSERT statements from the migration file');
  console.log('   File: supabase/migrations/003_battery_storage.sql\n');
  process.exit(1);
}

console.log('✅ Data inserted!\n');

// Verify
const { count } = await supabase
  .from('battery_storage')
  .select('*', { count: 'exact', head: true });

console.log(`✅ Verification: ${count} storage systems in database\n`);
console.log('🎉 Deployment complete!\n');
console.log('🔗 Visit: http://localhost:5173/storage\n');
