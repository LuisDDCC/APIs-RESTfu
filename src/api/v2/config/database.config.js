
import { createClient } from '@supabase/supabase-js';
import config from './config.js';

if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    throw new Error(
        'Faltan SUPABASE_URL o SUPABASE_KEY en el archivo .env'
    );
}

const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_KEY
);

export default supabase;
