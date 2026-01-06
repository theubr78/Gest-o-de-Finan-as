'use client';

import { useState, useEffect, useCallback } from 'react';
import { CaseService } from '@/services/case.service';
import { FileText, FilePlus, Trash2, Download, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface ProcessAttachmentsProps {
    caseId: string;
}

interface Attachment {
    name: string;
    id: string; // no supabase storage list, id is string? actually metadata
    metadata: {
        size: number;
        mimetype: string;
    };
    created_at: string;
}

export function ProcessAttachments({ caseId }: ProcessAttachmentsProps) {
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const loadFiles = useCallback(async () => {
        const service = new CaseService();
        try {
            const data = await service.listFiles(caseId);
            setFiles(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [caseId]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const service = new CaseService();
        setIsUploading(true);
        setError('');

        try {
            await service.uploadFile(caseId, file);
            await loadFiles();
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer upload');
        } finally {
            setIsUploading(false);
            // Reset input value
            e.target.value = '';
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Tem certeza que deseja excluir esse arquivo?')) return;

        const service = new CaseService();
        try {
            await service.deleteFile(caseId, fileName);
            setFiles(files.filter(f => f.name !== fileName));
        } catch (err: any) {
            setError('Erro ao excluir arquivo');
        }
    };

    const handleDownload = async (fileName: string) => {
        const service = new CaseService();
        try {
            const url = await service.getFileUrl(caseId, fileName);
            window.open(url, '_blank');
        } catch (err) {
            setError('Erro ao abrir arquivo');
        }
    };

    if (isLoading) return <div className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Anexos e Documentos
                </h3>

                <div className="relative">
                    <input
                        type="file"
                        id={`file-upload-${caseId}`}
                        className="hidden"
                        accept=".pdf,.txt"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor={`file-upload-${caseId}`}
                        className={`btn-secondary text-xs h-8 px-3 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                            <FilePlus className="h-3 w-3 mr-2" />
                        )}
                        {isUploading ? 'Enviando...' : 'Adicionar PDF/TXT'}
                    </label>
                </div>
            </div>

            {error && (
                <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </div>
            )}

            {files.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground">Nenhum arquivo anexado</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {files.map((file) => (
                        <div key={file.name} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.metadata?.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDownload(file.name)}
                                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                                    title="Baixar/Visualizar"
                                >
                                    <Download className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(file.name)}
                                    className="p-1.5 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-400"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
