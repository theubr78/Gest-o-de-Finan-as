import { BaseRepository } from './base.repository';
import { Transaction, TransactionWithClient, TransactionStatus } from '@/types/database.types';
import { getSupabase } from '@/lib/supabase/client';

/**
 * Repository para gerenciamento de Transações Financeiras
 * Implementa queries complexas com joins e filtros por data
 */
export class TransactionRepository extends BaseRepository<Transaction> {
    constructor() {
        super('transactions');
    }

    /**
     * Retorna todas as transações do usuário
     */
    async getAll(userId: string): Promise<Transaction[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Retorna uma transação específica
     */
    async getById(id: string, userId: string): Promise<Transaction | null> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    /**
     * Cria nova transação
     */
    async create(data: Partial<Transaction>): Promise<Transaction> {
        const supabase = getSupabase();
        const { data: newTransaction, error } = await supabase
            .from('transactions')
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return newTransaction;
    }

    /**
     * Atualiza transação existente
     */
    async update(id: string, data: Partial<Transaction>, userId: string): Promise<Transaction> {
        const supabase = getSupabase();
        const { data: updated, error } = await (supabase
            .from('transactions') as any)
            .update(data)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    }

    /**
     * Deleta transação
     */
    async delete(id: string, userId: string): Promise<void> {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Retorna transações com dados do cliente (JOIN)
     */
    async getWithClient(userId: string): Promise<TransactionWithClient[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        client:clients(id, name, whatsapp)
      `)
            .eq('user_id', userId)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data as any || [];
    }

    /**
     * Filtra transações por período (para dashboard)
     */
    async getByDateRange(userId: string, startDate: string, endDate: string): Promise<TransactionWithClient[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                client:clients(id, name, whatsapp)
            `)
            .eq('user_id', userId)
            .gte('due_date', startDate)
            .lte('due_date', endDate)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data as any || [];
    }

    /**
     * Retorna transações por status computado
     */
    async getByStatus(userId: string, status: TransactionStatus): Promise<Transaction[]> {
        const supabase = getSupabase();
        const now = new Date().toISOString().split('T')[0];

        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId);

        if (status === 'PAID') {
            query = query.not('payment_date', 'is', null);
        } else if (status === 'OVERDUE') {
            query = query.is('payment_date', null).lt('due_date', now);
        } else if (status === 'PENDING') {
            query = query.is('payment_date', null).gte('due_date', now);
        }

        const { data, error } = await query.order('due_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Retorna transações por categoria
     */
    async getByCategory(
        userId: string,
        category: 'honorarios' | 'recorrente' | 'exito' | 'custas'
    ): Promise<Transaction[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .eq('category', category)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Marca transação como paga
     */
    async markAsPaid(id: string, userId: string, paymentDate: string): Promise<Transaction> {
        return this.update(id, { payment_date: paymentDate }, userId);
    }

    /**
     * Retorna transações de um cliente específico
     */
    async getByClient(userId: string, clientId: string): Promise<Transaction[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .eq('client_id', clientId)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}
