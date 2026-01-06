import { CaseRepository } from '@/repositories/case.repository';
import { CaseModel, CreateCaseDTO } from '@/types/database.types';
import { caseSchema } from '@/lib/validations/schemas';
import { getCurrentUserId } from '@/lib/supabase/client';
import { formatCNJ, isValidCNJ } from '@/lib/utils/formatters';

/**
 * Service para gerenciamento de Processos
 */
export class CaseService {
    private repository: CaseRepository;

    constructor() {
        this.repository = new CaseRepository();
    }

    /**
     * Cria um novo processo
     */
    async createCase(data: CreateCaseDTO): Promise<CaseModel> {
        const validated = caseSchema.parse(data);
        const userId = await getCurrentUserId();

        // Formata número de processo CNJ se fornecido
        let processNumber = validated.process_number;
        if (processNumber && processNumber.trim() !== '') {
            processNumber = formatCNJ(processNumber);

            // Valida formato CNJ
            if (!isValidCNJ(processNumber)) {
                throw new Error(
                    'Número de processo inválido. Use formato CNJ: 0000000-00.0000.0.00.0000'
                );
            }
        } else {
            processNumber = null;
        }

        return await this.repository.create({
            ...validated,
            process_number: processNumber,
            user_id: userId,
        });
    }

    /**
     * Lista todos os processos
     */
    async listCases(): Promise<CaseModel[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getAll(userId);
    }

    /**
     * Busca processo por ID
     */
    async getCaseById(id: string): Promise<CaseModel | null> {
        const userId = await getCurrentUserId();
        return await this.repository.getById(id, userId);
    }

    /**
     * Atualiza processo
     */
    async updateCase(id: string, data: Partial<CreateCaseDTO>): Promise<CaseModel> {
        const validated = caseSchema.partial().parse(data);
        const userId = await getCurrentUserId();

        // Formata número de processo se fornecido
        if (validated.process_number) {
            validated.process_number = formatCNJ(validated.process_number);
        }

        return await this.repository.update(id, validated, userId);
    }

    /**
     * Deleta processo
     */
    async deleteCase(id: string): Promise<void> {
        const userId = await getCurrentUserId();
        await this.repository.delete(id, userId);
    }

    /**
     * Lista processos por status
     */
    async getCasesByStatus(status: string): Promise<CaseModel[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getByStatus(userId, status);
    }

    /**
     * Lista processos de um cliente
     */
    async getCasesByClient(clientId: string): Promise<CaseModel[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getByClient(userId, clientId);
    }

    /**
     * Upload de arquivo para processo
     */
    async uploadFile(caseId: string, file: File): Promise<string> {
        const userId = await getCurrentUserId();

        // Validação de tamanho (10MB)
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('O arquivo deve ter no máximo 10MB.');
        }

        return await this.repository.uploadAttachment(userId, caseId, file);
    }

    /**
     * Lista arquivos do processo
     */
    async listFiles(caseId: string) {
        const userId = await getCurrentUserId();
        return await this.repository.listAttachments(userId, caseId);
    }

    /**
     * Remove arquivo
     */
    async deleteFile(caseId: string, fileName: string): Promise<void> {
        const userId = await getCurrentUserId();
        await this.repository.deleteAttachment(userId, caseId, fileName);
    }

    /**
     * Obtém URL de download
     */
    async getFileUrl(caseId: string, fileName: string): Promise<string> {
        const userId = await getCurrentUserId();
        return await this.repository.getDownloadUrl(userId, caseId, fileName);
    }
}
