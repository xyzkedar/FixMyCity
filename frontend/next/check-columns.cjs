
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else if (data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No data to determine columns');
    }
}

checkColumns();
