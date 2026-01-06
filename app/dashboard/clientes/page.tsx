'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientTable } from '@/components/clients/ClientTable';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Client } from '@/types/database.types';

export default function ClientsPage() {
    const { clients, isLoading, createClient, updateClient, deleteClient } = useClients();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFormSubmit = async (data: any) => {
        if (editingClient) {
            await updateClient(editingClient.id, data);
        } else {
            await createClient(data);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const openCreateModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
                    <p className="text-dark-400">Gerencie seus clientes e contatos</p>
                </div>

                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Novo Cliente
                </button>
            </div>

            {/* Search */}
            <div className="card-premium">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nome..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium w-full pl-12"
                    />
                </div>
            </div>

            {/* Client Table */}
            {isLoading ? (
                <div className="card-premium flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                </div>
            ) : (
                <ClientTable
                    clients={filteredClients}
                    onUpdate={updateClient}
                    onDelete={deleteClient}
                    onEdit={openEditModal}
                />
            )}

            {/* Create/Edit Client Modal */}
            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingClient(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingClient}
            />
        </div>
    );
}
