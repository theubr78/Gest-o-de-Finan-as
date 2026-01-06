'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/lib/validations/schemas';
import { CreateClientDTO, Client } from '@/types/database.types';
import { X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateClientDTO) => Promise<any>;
    initialData?: Client | null;
}

/**
 * Modal de Formulário de Cliente com React Hook Form + Zod
 */
export function ClientFormModal({ isOpen, onClose, onSubmit, initialData }: ClientFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('whatsapp', initialData.whatsapp || '');
            } else {
                reset({ name: '', whatsapp: '' });
            }
        }
    }, [isOpen, initialData, setValue, reset]);

    const handleFormSubmit = async (data: ClientFormData) => {
        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar cliente');
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
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="card-premium w-full max-w-md relative"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {initialData ? 'Editar Cliente' : 'Novo Cliente'}
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-dark-400" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Nome Completo *
                                    </label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className="input-premium w-full"
                                        placeholder="Ex: João da Silva"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        {...register('whatsapp')}
                                        type="text"
                                        className="input-premium w-full"
                                        placeholder="+5511999999999"
                                    />
                                    <p className="text-dark-500 text-xs mt-1">
                                        Formato internacional (opcional)
                                    </p>
                                    {errors.whatsapp && (
                                        <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>
                                    )}
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Actions */}
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
                                        {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar' : 'Criar Cliente')}
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
