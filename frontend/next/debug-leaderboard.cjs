
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugData() {
    const { data: reports, error } = await supabase
        .from('reports')
        .select('id, status, user_id, resolved_by');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Total Reports:', reports.length);
        console.log('Reports Analysis:', reports.map(r => ({
            id: r.id.substring(0, 8),
            status: r.status,
            resolved_by: r.resolved_by ? 'SET' : 'NULL'
        })));
    }
}

debugData();
