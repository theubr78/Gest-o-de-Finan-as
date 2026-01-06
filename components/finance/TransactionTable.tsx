'use client';

import { TransactionWithClient } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { FinanceService } from '@/services/finance.service';
import { CheckCircle, Trash2, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface TransactionTableProps {
    transactions: TransactionWithClient[];
    onMarkAsPaid: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const CATEGORY_LABELS = {
    honorarios: 'Honorários',
    recorrente: 'Recorrente',
    exito: 'Êxito',
    custas: 'Custas',
};

const CATEGORY_COLORS = {
    honorarios: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    recorrente: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    exito: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    custas: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

/**
 * Tabela de Transações com status visual e ações
 */
export function TransactionTable({ transactions, onMarkAsPaid, onDelete }: TransactionTableProps) {
    const service = new FinanceService();

    const handleDelete = async (id: string, description: string) => {
        if (confirm(`Tem certeza que deseja excluir a transação "${description}"?`)) {
            await onDelete(id);
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="card-premium flex flex-col items-center justify-center h-64 text-dark-400">
                <DollarSign className="h-16 w-16 mb-4 opacity-50" />
                <p>Nenhuma transação encontrada neste período</p>
            </div>
        );
    }

    return (
        <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-800">
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Cliente</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Descrição</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Categoria</th>
                            <th className="text-right p-4 text-sm font-semibold text-dark-300">Valor</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Vencimento</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Status</th>
                            <th className="text-right p-4 text-sm font-semibold text-dark-300">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => {
                            const status = service.computeStatus(transaction);
                            const isPaid = status === 'PAID';
                            const isOverdue = status === 'OVERDUE';

                            return (
                                <motion.tr
                                    key={transaction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        'border-b border-dark-800 transition-colors',
                                        isPaid ? 'bg-emerald-500/5' : isOverdue ? 'bg-red-500/5' : 'hover:bg-dark-800/50'
                                    )}
                                >
                                    <td className="p-4 text-white font-medium">
                                        {transaction.client?.name || 'N/A'}
                                    </td>
                                    <td className="p-4 text-dark-300">{transaction.description}</td>
                                    <td className="p-4">
                                        <span className={cn('badge', CATEGORY_COLORS[transaction.category])}>
                                            {CATEGORY_LABELS[transaction.category]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-semibold text-white">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="p-4 text-dark-300">
                                        {formatDate(transaction.due_date)}
                                    </td>
                                    <td className="p-4">
                                        {isPaid ? (
                                            <span className="badge badge-success">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Pago
                                            </span>
                                        ) : isOverdue ? (
                                            <span className="badge badge-danger">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Atrasado
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pendente
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!isPaid && (
                                                <button
                                                    onClick={() => onMarkAsPaid(transaction.id)}
                                                    className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                                                    title="Marcar como pago"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(transaction.id, transaction.description)}
                                                className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-dark-800 flex items-center justify-between text-sm">
                <div className="text-dark-400">
                    Total: {transactions.length} transaç{transactions.length !== 1 ? 'ões' : 'ão'}
                </div>
                <div className="font-semibold text-white">
                    Total: {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                </div>
            </div>
        </div>
    );
}
