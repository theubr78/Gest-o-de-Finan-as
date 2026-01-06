'use client';

import { useEffect, useState } from 'react';
import { FinanceService } from '@/services/finance.service';
import { DashboardSummary } from '@/types/database.types';

/**
 * Hook customizado para dados do dashboard
 * Encapsula lógica de fetching e estado
 */
export function useDashboardSummary() {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const service = new FinanceService();

        service
            .getDashboardSummary()
            .then(setData)
            .catch((err) => {
                console.error('Erro ao carregar dashboard:', err);
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const refetch = async () => {
        setIsLoading(true);
        const service = new FinanceService();
        try {
            const newData = await service.getDashboardSummary();
            setData(newData);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, refetch };
}
