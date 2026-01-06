'use client';

import { useState, useEffect } from 'react';
import { CaseService } from '@/services/case.service';
import { CaseModel } from '@/types/database.types';
import { ProcessFormModal } from '@/components/cases/ProcessFormModal';
import { ProcessAttachments } from '@/components/cases/ProcessAttachments';
import { Plus, Search, Scale, FileText, ChevronDown, ChevronUp, AlertCircle, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProcessosPage() {
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<CaseModel | null>(null);
    const [search, setSearch] = useState('');
    const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
    const service = new CaseService();

    const loadCases = async () => {
        setIsLoading(true);
        try {
            const data = await service.listCases();
            setCases(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    const handleCreateSuccess = async () => {
        await loadCases();
    };

    const handleEdit = (process: CaseModel) => {
        setEditingCase(process);
        setIsCreateModalOpen(true);
    };

    const handleModalClose = () => {
        setIsCreateModalOpen(false);
        setEditingCase(null);
    };

    const handleModalSubmit = async (data: any) => {
        if (editingCase) {
            await service.updateCase(editingCase.id, data);
        } else {
            await service.createCase(data);
        }
        await loadCases();
    };

    const toggleExpand = (id: string) => {
        setExpandedCaseId(expandedCaseId === id ? null : id);
    };

    const filteredCases = cases.filter(c =>
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.process_number?.includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Processos e Casos</h1>
                    <p className="text-muted-foreground">Gerencie seus processos jurídicos e arquive documentos.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingCase(null);
                        setIsCreateModalOpen(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="h-4 w-4" />
                    Novo Processo
                </button>
            </div>

            {/* Filtros */}
            <div className="card-premium p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por título ou número do processo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-premium pl-10"
                    />
                </div>
            </div>

            {/* Lista */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="skeleton h-24 w-full rounded-xl" />
                    ))}
                </div>
            ) : filteredCases.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                        <Scale className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Nenhum processo encontrado</h3>
                    <p className="text-muted-foreground mt-1">Crie um novo processo para começar a organizar seus documentos.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCases.map((process) => (
                        <motion.div
                            key={process.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card-premium transition-all ${expandedCaseId === process.id ? 'ring-2 ring-primary/20' : ''}`}
                        >
                            <div
                                onClick={() => toggleExpand(process.id)}
                                className="flex items-start justify-between cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${process.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' :
                                        process.status === 'Arquivado' ? 'bg-gray-500/10 text-gray-400' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        <Scale className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{process.description || 'Processo sem título'}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                            {process.process_number && (
                                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                                    {process.process_number}
                                                </span>
                                            )}
                                            <span>•</span>
                                            <span>Criado em {formatDate(process.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`badge ${process.status === 'Ativo' ? 'badge-success' :
                                        process.status === 'Concluído' ? 'badge-success' : 'badge-warning'
                                        }`}>
                                        {process.status}
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(process);
                                        }}
                                        className="p-2 hover:bg-muted rounded-full transition-colors"
                                        title="Editar Processo"
                                    >
                                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                                    </button>

                                    {expandedCaseId === process.id ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedCaseId === process.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 mt-6 border-t border-border">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-foreground mb-4">Detalhes</h4>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between py-2 border-b border-border border-dashed">
                                                            <span className="text-muted-foreground">ID Interno</span>
                                                            <span className="font-mono text-xs">{process.id.slice(0, 8)}...</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border border-dashed">
                                                            <span className="text-muted-foreground">Status Atual</span>
                                                            <span className="text-foreground">{process.status}</span>
                                                        </div>
                                                        {/* Aqui poderia vir info do cliente se tivessmos o join */}
                                                    </div>
                                                </div>

                                                <div>
                                                    {/* Componente de Anexos */}
                                                    <ProcessAttachments caseId={process.id} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            <ProcessFormModal
                isOpen={isCreateModalOpen}
                initialData={editingCase}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}
