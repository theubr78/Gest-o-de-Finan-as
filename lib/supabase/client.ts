import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Vanilla (Fallback / Server)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Obtém o cliente Supabase adequado para o ambiente.
 * No browser, usa createClientComponentClient para ler cookies corretamente.
 */
export const getSupabase = () => {
    if (typeof window !== 'undefined') {
        return createClientComponentClient<Database>();
    }
    return supabase;
};

// Helper para obter o usuário autenticado
export async function getCurrentUser() {
    const client = getSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
        console.warn("Erro ao obter usuário:", error.message);
        return null;
    }
    return user;
}

// Helper para obter o ID do usuário autenticado
export async function getCurrentUserId(): Promise<string> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Auth session missing!');
    return user.id;
}
