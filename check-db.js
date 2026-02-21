
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Total Reports in DB:', count);
    }
}

check();
