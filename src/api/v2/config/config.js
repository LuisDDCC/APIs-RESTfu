import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// v2/config -> v2 -> api -> src -> raíz del repo (donde está el .env)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export default {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3020,
    API_URL: process.env.API_URL || '/api/v2',
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    DATABASE: process.env.DATABASE,
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || '',
};