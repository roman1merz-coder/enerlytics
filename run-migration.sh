#!/bin/bash
set -e

echo "🚀 Deploying Battery Storage Migration to Supabase..."
echo ""

# Read the migration SQL
SQL=$(cat supabase/migrations/003_battery_storage.sql)

# Execute using Supabase REST API
echo "⚡ Executing SQL migration..."

curl -X POST "https://mxboigeahudnbigxgefp.supabase.co/rest/v1/rpc/exec" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ym9pZ2VhaHVkbmJpZ3hnZWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMDU5OSwiZXhwIjoyMDg2NTg2NTk5fQ.h9UfQD9Oq85m_LV0pLQvtqhrmOBhIuwlnsa02dIwKK0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ym9pZ2VhaHVkbmJpZ3hnZWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMDU5OSwiZXhwIjoyMDg2NTg2NTk5fQ.h9UfQD9Oq85m_LV0pLQvtqhrmOBhIuwlnsa02dIwKK0" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL" | jq -Rs .)}"

echo ""
echo "✅ Migration complete!"
