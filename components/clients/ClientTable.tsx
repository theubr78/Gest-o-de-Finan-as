'use client';

import { Client } from '@/types/database.types';
import { formatDate } from '@/lib/utils/formatters';
import { User, Phone, Trash2, Edit, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientTableProps {
    clients: Client[];
    onUpdate: (id: string, data: any) => Promise<any>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (client: Client) => void;
}

/**
 * Tabela de clientes com ações
 */
export function ClientTable({ clients, onUpdate, onDelete, onEdit }: ClientTableProps) {
    const handleWhatsApp = (whatsapp: string | null) => {
        if (!whatsapp) return;
        window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja excluir o cliente "${name}"?\n\nISSO TAMBÉM DELETARÁ TODAS AS TRANSAÇÕES RELACIONADAS.`)) {
            await onDelete(id);
        }
    };

    if (clients.length === 0) {
        return (
            <div className="card-premium flex flex-col items-center justify-center h-64 text-dark-400">
                <User className="h-16 w-16 mb-4 opacity-50" />
                <p>Nenhum cliente encontrado</p>
            </div>
        );
    }

    return (
        <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-800">
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Nome</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">WhatsApp</th>
                            <th className="text-left p-4 text-sm font-semibold text-dark-300">Cadastrado em</th>
                            <th className="text-right p-4 text-sm font-semibold text-dark-300">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <motion.tr
                                key={client.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-400" />
                                        </div>
                                        <span className="font-medium text-white">{client.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-dark-300">
                                    {client.whatsapp ? (
                                        <button
                                            onClick={() => handleWhatsApp(client.whatsapp)}
                                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            <Phone className="h-4 w-4" />
                                            {client.whatsapp}
                                        </button>
                                    ) : (
                                        <span className="text-dark-500">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-dark-300">{formatDate(client.created_at.split('T')[0])}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(client)}
                                            className="p-2 hover:bg-primary-500/10 text-primary-400 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>

                                        {client.whatsapp && (
                                            <button
                                                onClick={() => handleWhatsApp(client.whatsapp)}
                                                className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                                                title="Enviar WhatsApp"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(client.id, client.name)}
                                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-dark-800 text-sm text-dark-400">
                Total: {clients.length} cliente{clients.length !== 1 && 's'}
            </div>
        </div>
    );
}
