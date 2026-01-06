'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@/lib/validations/schemas';
import { CreateTransactionDTO } from '@/types/database.types';
import { useClients } from '@/hooks/useClients';
import { X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toISODate } from '@/lib/utils/formatters';

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTransactionDTO) => Promise<any>;
}

/**
 * Modal de Formulário de Transação
 */
export function TransactionFormModal({ isOpen, onClose, onSubmit }: TransactionFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { clients } = useClients();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<any>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            due_date: toISODate(new Date()),
        },
    });

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao criar transação');
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
                                <h2 className="text-2xl font-bold text-white">Nova Transação</h2>
                                <button onClick={handleClose} className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                                    <X className="h-5 w-5 text-dark-400" />
                                </button>
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
                                            Categoria *
                                        </label>
                                        <select {...register('category')} className="input-premium w-full">
                                            <option value="honorarios">Honorários</option>
                                            <option value="recorrente">Recorrente</option>
                                            <option value="exito">Êxito</option>
                                            <option value="custas">Custas</option>
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-400 text-sm mt-1">{errors.category.message as string}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Vencimento *
                                    </label>
                                    <input
                                        {...register('due_date')}
                                        type="date"
                                        className="input-premium w-full"
                                    />
                                    {errors.due_date && (
                                        <p className="text-red-400 text-sm mt-1">{errors.due_date.message as string}</p>
                                    )}
                                </div>

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
                                        {isSubmitting ? 'Criando...' : 'Criar Transação'}
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
