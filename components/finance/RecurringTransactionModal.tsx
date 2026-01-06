'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recurringTransactionSchema } from '@/lib/validations/schemas';
import { RecurringTransactionDTO } from '@/types/database.types';
import { useClients } from '@/hooks/useClients';
import { X, Loader2, Repeat } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface RecurringTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RecurringTransactionDTO) => Promise<any>;
}

/**
 * Modal para criar transações recorrentes
 * Ex: Honorários mensais em 12 parcelas
 */
export function RecurringTransactionModal({ isOpen, onClose, onSubmit }: RecurringTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { clients } = useClients();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<any>({
        resolver: zodResolver(recurringTransactionSchema),
    });

    const installments = watch('installments', 1);
    const amount = watch('amount', 0);

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        setError('');

        try {
            // Converte data string para Date object
            const formData = {
                ...data,
                startDate: new Date(data.startDate),
            };

            await onSubmit(formData);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao criar transações recorrentes');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="card-premium w-full max-w-md relative max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Repeat className="h-6 w-6 text-primary-400" />
                                    <h2 className="text-2xl font-bold text-white">Transação Recorrente</h2>
                                </div>
                                <button onClick={handleClose} className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                                    <X className="h-5 w-5 text-dark-400" />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-sm text-blue-400">
                                    Crie múltiplas transações automaticamente. Ideal para honorários mensais.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Cliente *</label>
                                    <select {...register('client_id')} className="input-premium w-full">
                                        <option value="">Selecione um cliente</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && (
                                        <p className="text-red-400 text-sm mt-1">{errors.client_id.message as string}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Descrição *
                                    </label>
                                    <input
                                        {...register('description')}
                                        type="text"
                                        className="input-premium w-full"
                                        placeholder="Ex: Honorários mensais"
                                    />
                                    <p className="text-dark-500 text-xs mt-1">
                                        Numeração automática será adicionada (1/12, 2/12, etc)
                                    </p>
                                    {errors.description && (
                                        <p className="text-red-400 text-sm mt-1">{errors.description.message as string}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-300 mb-2">
                                            Valor (R$) *
                                        </label>
                                        <input
                                            {...register('amount', { valueAsNumber: true })}
                                            type="number"
                                            step="0.01"
                                            className="input-premium w-full"
                                            placeholder="0,00"
                                        />
                                        {errors.amount && (
                                            <p className="text-red-400 text-sm mt-1">{errors.amount.message as string}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark-300 mb-2">
                                            Parcelas *
                                        </label>
                                        <input
                                            {...register('installments', { valueAsNumber: true })}
                                            type="number"
                                            className="input-premium w-full"
                                            placeholder="12"
                                            min="2"
                                            max="120"
                                        />
                                        {errors.installments && (
                                            <p className="text-red-400 text-sm mt-1">{errors.installments.message as string}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Data de Início *
                                    </label>
                                    <input
                                        {...register('startDate')}
                                        type="date"
                                        className="input-premium w-full"
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-400 text-sm mt-1">{errors.startDate.message as string}</p>
                                    )}
                                </div>

                                {/* Resumo */}
                                {installments > 0 && amount > 0 && (
                                    <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                                        <p className="text-sm text-dark-300 mb-2">Resumo:</p>
                                        <ul className="text-sm text-primary-400 space-y-1">
                                            <li>• Serão criadas <strong>{installments}</strong> transações</li>
                                            <li>• Valor mensal: <strong>R$ {amount.toFixed(2)}</strong></li>
                                            <li>• Total: <strong>R$ {(amount * installments).toFixed(2)}</strong></li>
                                        </ul>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="btn-secondary flex-1"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isSubmitting ? 'Criando...' : `Criar ${installments || 0} Transações`}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
