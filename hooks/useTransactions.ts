'use client';

import { useEffect, useState, useCallback } from 'react';
import { FinanceService } from '@/services/finance.service';
import {
    Transaction,
    TransactionWithClient,
    CreateTransactionDTO,
    RecurringTransactionDTO,
    PeriodFilter,
} from '@/types/database.types';

/**
 * Hook para gerenciamento de transações financeiras
 */
export function useTransactions() {
    const [transactions, setTransactions] = useState<TransactionWithClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState<PeriodFilter>('month');

    const service = new FinanceService();

    const loadTransactions = useCallback(async (filterPeriod?: PeriodFilter) => {
        setIsLoading(true);
        try {
            const currentPeriod = filterPeriod || period;
            const data = await service.listTransactionsByPeriod(currentPeriod);
            setTransactions(data as any);
            setError(null);
        } catch (err: any) {
            console.error('Erro ao carregar transações:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [period]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const createTransaction = useCallback(async (data: CreateTransactionDTO) => {
        try {
            const newTransaction = await service.createTransaction(data);
            await loadTransactions();
            return newTransaction;
        } catch (err: any) {
            console.error('Erro ao criar transação:', err);
            throw err;
        }
    }, [loadTransactions]);

    const createRecurring = useCallback(
        async (data: RecurringTransactionDTO) => {
            try {
                const newTransactions = await service.createRecurringTransactions(data);
                await loadTransactions();
                return newTransactions;
            } catch (err: any) {
                console.error('Erro ao criar transações recorrentes:', err);
                throw err;
            }
        },
        [loadTransactions]
    );

    const markAsPaid = useCallback(
        async (id: string, paymentDate?: string) => {
            try {
                await service.markAsPaid(id, paymentDate);
                await loadTransactions();
            } catch (err: any) {
                console.error('Erro ao marcar como pago:', err);
                throw err;
            }
        },
        [loadTransactions]
    );

    const updateTransaction = useCallback(
        async (id: string, data: Partial<CreateTransactionDTO>) => {
            try {
                const updated = await service.updateTransaction(id, data);
                await loadTransactions();
                return updated;
            } catch (err: any) {
                console.error('Erro ao atualizar transação:', err);
                throw err;
            }
        },
        [loadTransactions]
    );

    const deleteTransaction = useCallback(
        async (id: string) => {
            try {
                await service.deleteTransaction(id);
                await loadTransactions();
            } catch (err: any) {
                console.error('Erro ao deletar transação:', err);
                throw err;
            }
        },
        [loadTransactions]
    );

    const changePeriod = useCallback((newPeriod: PeriodFilter) => {
        setPeriod(newPeriod);
        loadTransactions(newPeriod);
    }, [loadTransactions]);

    return {
        transactions,
        isLoading,
        error,
        period,
        loadTransactions,
        createTransaction,
        createRecurring,
        markAsPaid,
        updateTransaction,
        deleteTransaction,
        changePeriod,
    };
}
