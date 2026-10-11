import { createClient } from '@supabase/supabase-js';
import config from './config.js';

if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.error('Supabase: faltan SUPABASE_URL o SUPABASE_KEY en el .env');
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// Chequeo temporal: borrar cuando funcione


const { error } = await supabase.from('cat_institutos').select('id').limit(1);
if (error) {
    console.error('Error Supabase:', error.message);
} else {
    console.log('Supabase conectado a:', new URL(config.SUPABASE_URL).host);
}

export default supabase;