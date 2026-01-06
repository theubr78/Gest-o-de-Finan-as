'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClientService } from '@/services/client.service';
import { Client, CreateClientDTO } from '@/types/database.types';

/**
 * Hook para gerenciamento de clientes
 */
export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const service = new ClientService();

    const loadClients = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await service.listClients();
            setClients(data);
            setError(null);
        } catch (err: any) {
            console.error('Erro ao carregar clientes:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    const createClient = useCallback(async (data: CreateClientDTO) => {
        try {
            const newClient = await service.createClient(data);
            setClients((prev) => [newClient, ...prev]);
            return newClient;
        } catch (err: any) {
            console.error('Erro ao criar cliente:', err);
            throw err;
        }
    }, []);

    const updateClient = useCallback(async (id: string, data: Partial<CreateClientDTO>) => {
        try {
            const updated = await service.updateClient(id, data);
            setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
            return updated;
        } catch (err: any) {
            console.error('Erro ao atualizar cliente:', err);
            throw err;
        }
    }, []);

    const deleteClient = useCallback(async (id: string) => {
        try {
            await service.deleteClient(id);
            setClients((prev) => prev.filter((c) => c.id !== id));
        } catch (err: any) {
            console.error('Erro ao deletar cliente:', err);
            throw err;
        }
    }, []);

    const searchClients = useCallback(async (query: string) => {
        try {
            const results = await service.searchClients(query);
            return results;
        } catch (err: any) {
            console.error('Erro ao buscar clientes:', err);
            return [];
        }
    }, []);

    return {
        clients,
        isLoading,
        error,
        loadClients,
        createClient,
        updateClient,
        deleteClient,
        searchClients,
    };
}
