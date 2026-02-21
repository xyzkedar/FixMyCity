
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResolved() {
    const { data, error } = await supabase
        .from('reports')
        .select('id, status, resolved_by, resolved_at')
        .eq('status', 'resolved');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Resolved Reports:', JSON.stringify(data, null, 2));
    }
}

checkResolved();
