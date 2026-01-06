'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionFormModal } from '@/components/finance/TransactionFormModal';
import { RecurringTransactionModal } from '@/components/finance/RecurringTransactionModal';
import { TransactionTable } from '@/components/finance/TransactionTable';
import { PeriodFilter } from '@/components/finance/PeriodFilter';
import { Plus, Repeat, Loader2 } from 'lucide-react';

export default function FinancePage() {
    const {
        transactions,
        isLoading,
        period,
        createTransaction,
        createRecurring,
        markAsPaid,
        deleteTransaction,
        changePeriod,
    } = useTransactions();

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
                    <p className="text-dark-400">Gestão de transações e honorários</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsRecurringModalOpen(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Repeat className="h-5 w-5" />
                        Recorrente
                    </button>

                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Nova Transação
                    </button>
                </div>
            </div>

            {/* Period Filter */}
            <PeriodFilter value={period} onChange={changePeriod} />

            {/* Transaction Table */}
            {isLoading ? (
                <div className="card-premium flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                </div>
            ) : (
                <TransactionTable
                    transactions={transactions}
                    onMarkAsPaid={markAsPaid}
                    onDelete={deleteTransaction}
                />
            )}

            {/* Modals */}
            <TransactionFormModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onSubmit={createTransaction}
            />

            <RecurringTransactionModal
                isOpen={isRecurringModalOpen}
                onClose={() => setIsRecurringModalOpen(false)}
                onSubmit={createRecurring}
            />
        </div>
    );
}
