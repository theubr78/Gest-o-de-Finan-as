import { BaseRepository } from './base.repository';
import { Client } from '@/types/database.types';
import { getSupabase } from '@/lib/supabase/client';

/**
 * Repository para gerenciamento de Clientes
 * Implementa Repository Pattern para abstrair acesso ao banco
 */
export class ClientRepository extends BaseRepository<Client> {
    constructor() {
        super('clients');
    }

    /**
     * Retorna todos os clientes do advogado, ordenados por data de criação
     */
    async getAll(userId: string): Promise<Client[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Retorna um cliente específico por ID
     */
    async getById(id: string, userId: string): Promise<Client | null> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data;
    }

    /**
     * Cria um novo cliente
     */
    async create(data: Partial<Client>): Promise<Client> {
        const supabase = getSupabase();
        const { data: newClient, error } = await supabase
            .from('clients')
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return newClient;
    }

    /**
     * Atualiza um cliente existente
     */
    async update(id: string, data: Partial<Client>, userId: string): Promise<Client> {
        const supabase = getSupabase();
        const { data: updatedClient, error } = await supabase
            .from('clients')
            .update(data as any)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return updatedClient;
    }

    /**
     * Deleta um cliente (CASCADE deletará transações relacionadas)
     */
    async delete(id: string, userId: string): Promise<void> {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Busca clientes por nome (case-insensitive)
     */
    async searchByName(userId: string, query: string): Promise<Client[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', userId)
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    /**
     * Retorna clientes com processos ativos
     */
    async getClientsWithActiveCases(userId: string): Promise<Client[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('clients')
            .select(`
        *,
        cases!inner(*)
      `)
            .eq('user_id', userId)
            .eq('cases.status', 'Ativo');

        if (error) throw error;
        return data || [];
    }
}
