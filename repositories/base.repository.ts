import { supabase } from '@/lib/supabase/client';

/**
 * Classe abstrata base para implementar Repository Pattern
 * Garante que todos os repositories tenham operações CRUD consistentes
 * Segue o princípio DRY (Don't Repeat Yourself)
 */
export abstract class BaseRepository<T> {
    constructor(protected tableName: string) { }

    /**
     * Retorna todos os registros do usuário autenticado
     */
    abstract getAll(userId: string): Promise<T[]>;

    /**
     * Retorna um registro específico por ID
     */
    abstract getById(id: string, userId: string): Promise<T | null>;

    /**
     * Cria um novo registro
     */
    abstract create(data: Partial<T>): Promise<T>;

    /**
     * Atualiza um registro existente
     */
    abstract update(id: string, data: Partial<T>, userId: string): Promise<T>;

    /**
     * Deleta um registro
     */
    abstract delete(id: string, userId: string): Promise<void>;

    /**
     * Helper genérico para queries com RLS automático
     */
    protected getQuery(userId: string) {
        return supabase
            .from(this.tableName)
            .select('*')
            .eq('user_id', userId);
    }
}
