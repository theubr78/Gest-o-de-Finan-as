import { BaseRepository } from './base.repository';
import { CaseModel } from '@/types/database.types';
import { getSupabase } from '@/lib/supabase/client';

/**
 * Repository para gerenciamento de Processos (Cases)
 */
export class CaseRepository extends BaseRepository<CaseModel> {
    constructor() {
        super('cases');
    }

    async getAll(userId: string): Promise<CaseModel[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getById(id: string, userId: string): Promise<CaseModel | null> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('cases')
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

    async create(data: Partial<CaseModel>): Promise<CaseModel> {
        const supabase = getSupabase();
        const { data: newCase, error } = await supabase
            .from('cases')
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return newCase;
    }

    async update(id: string, data: Partial<CaseModel>, userId: string): Promise<CaseModel> {
        const supabase = getSupabase();
        const { data: updated, error } = await (supabase
            .from('cases') as any)
            .update(data)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    }

    async delete(id: string, userId: string): Promise<void> {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('cases')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
    }

    async getByStatus(userId: string, status: string): Promise<CaseModel[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .eq('user_id', userId)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getByClient(userId: string, clientId: string): Promise<CaseModel[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .eq('user_id', userId)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async uploadAttachment(userId: string, caseId: string, file: File): Promise<string> {
        if (!['application/pdf', 'text/plain'].includes(file.type)) {
            throw new Error('Apenas arquivos PDF ou TXT são permitidos.');
        }

        const supabase = getSupabase();
        const filePath = `${userId}/${caseId}/${file.name}`;

        const { error } = await supabase.storage
            .from('process-files')
            .upload(filePath, file, { upsert: true });

        if (error) throw error;
        return filePath;
    }

    async listAttachments(userId: string, caseId: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase.storage
            .from('process-files')
            .list(`${userId}/${caseId}`);

        if (error) throw error;
        return data || [];
    }

    async deleteAttachment(userId: string, caseId: string, fileName: string): Promise<void> {
        const supabase = getSupabase();
        const { error } = await supabase.storage
            .from('process-files')
            .remove([`${userId}/${caseId}/${fileName}`]);

        if (error) throw error;
    }

    async getDownloadUrl(userId: string, caseId: string, fileName: string): Promise<string> {
        const supabase = getSupabase();
        const { data, error } = await supabase.storage
            .from('process-files')
            .createSignedUrl(`${userId}/${caseId}/${fileName}`, 3600);

        if (error) throw error;
        return data.signedUrl;
    }
}
