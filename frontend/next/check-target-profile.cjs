
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfile() {
    const targetId = '0c474c15-1401-4e62-8dd5-39611de54e4c';
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

    if (error) {
        console.error('Profile not found for ID:', targetId, error.message);
    } else {
        console.log('Profile found:', data);
    }
}

checkProfile();
