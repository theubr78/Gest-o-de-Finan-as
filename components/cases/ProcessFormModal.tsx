'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { caseSchema, CaseFormData } from '@/lib/validations/schemas';
import { X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CaseModel, Client } from '@/types/database.types';
import { ClientService } from '@/services/client.service';

interface ProcessFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CaseFormData) => Promise<any>;
    initialData?: CaseModel | null;
}

export function ProcessFormModal({ isOpen, onClose, onSubmit, initialData }: ProcessFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CaseFormData>({
        resolver: zodResolver(caseSchema),
    });

    // Carrega clientes (e preenche form se edição)
    useEffect(() => {
        if (isOpen) {
            const clientService = new ClientService();
            clientService.listClients().then(setClients);

            if (initialData) {
                reset({
                    client_id: initialData.client_id,
                    process_number: initialData.process_number || '',
                    description: initialData.description || '',
                    status: initialData.status || 'Ativo',
                });
            } else {
                reset({
                    client_id: '',
                    process_number: '',
                    description: '',
                    status: 'Ativo'
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const handleFormSubmit = async (data: CaseFormData) => {
        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar processo');
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
                                <h2 className="text-2xl font-bold text-foreground">
                                    {initialData ? 'Editar Processo' : 'Novo Processo'}
                                </h2>
                                <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                    <X className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                {/* Cliente */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Cliente *</label>
                                    <select
                                        {...register('client_id')}
                                        className="input-premium w-full"
                                    >
                                        <option value="">Selecione um cliente</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && (
                                        <p className="text-destructive text-sm mt-1">{errors.client_id.message}</p>
                                    )}
                                </div>

                                {/* Número do Processo */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Número CNJ</label>
                                    <input
                                        {...register('process_number')}
                                        type="text"
                                        className="input-premium w-full"
                                        placeholder="0000000-00.0000.0.00.0000"
                                    />
                                    <p className="text-muted-foreground text-xs mt-1">Formato CNJ padrão (opcional)</p>
                                    {errors.process_number && (
                                        <p className="text-destructive text-sm mt-1">{errors.process_number.message}</p>
                                    )}
                                </div>

                                {/* Descrição */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Descrição / Título</label>
                                    <input
                                        {...register('description')}
                                        className="input-premium w-full"
                                        placeholder="Ex: Ação de Divórcio"
                                    />
                                    {errors.description && (
                                        <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                                    <select
                                        {...register('status')}
                                        className="input-premium w-full"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Arquivado">Arquivado</option>
                                        <option value="Suspenso">Suspenso</option>
                                        <option value="Concluído">Concluído</option>
                                    </select>
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
                                        className="btn-primary flex-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isSubmitting ? 'Salvar' : 'Criar Processo'}
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
