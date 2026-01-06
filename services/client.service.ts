import { ClientRepository } from '@/repositories/client.repository';
import { Client, CreateClientDTO, UpdateClientDTO } from '@/types/database.types';
import { clientSchema } from '@/lib/validations/schemas';
import { getCurrentUserId } from '@/lib/supabase/client';
import { formatWhatsApp } from '@/lib/utils/formatters';

/**
 * Service para gerenciamento de Clientes
 * Encapsula lógica de negócio e validações
 * Componentes React NUNCA devem acessar o Repository diretamente
 */
export class ClientService {
    private repository: ClientRepository;

    constructor() {
        this.repository = new ClientRepository();
    }

    /**
     * Cria um novo cliente com validação completa
     */
    async createClient(data: CreateClientDTO): Promise<Client> {
        // Validação com Zod
        const validated = clientSchema.parse(data);

        // Formata WhatsApp se fornecido
        let whatsappFormatted = validated.whatsapp;
        if (whatsappFormatted && whatsappFormatted.trim() !== '') {
            whatsappFormatted = formatWhatsApp(whatsappFormatted);

            // Validação E.164
            const e164Regex = /^\+?[1-9]\d{1,14}$/;
            if (!e164Regex.test(whatsappFormatted)) {
                throw new Error(
                    'WhatsApp inválido. Use formato internacional (ex: +5511999999999)'
                );
            }
        } else {
            whatsappFormatted = null;
        }

        // Obter ID do usuário autenticado
        const userId = await getCurrentUserId();

        // Criar cliente no banco
        return await this.repository.create({
            ...validated,
            whatsapp: whatsappFormatted,
            user_id: userId,
        });
    }

    /**
     * Lista todos os clientes do usuário autenticado
     */
    async listClients(): Promise<Client[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getAll(userId);
    }

    /**
     * Busca um cliente por ID
     */
    async getClientById(id: string): Promise<Client | null> {
        const userId = await getCurrentUserId();
        return await this.repository.getById(id, userId);
    }

    /**
     * Atualiza um cliente existente
     */
    async updateClient(id: string, data: UpdateClientDTO): Promise<Client> {
        // Validação parcial
        const validated = clientSchema.partial().parse(data);

        // Formata WhatsApp se fornecido
        if (validated.whatsapp) {
            validated.whatsapp = formatWhatsApp(validated.whatsapp);
        }

        const userId = await getCurrentUserId();
        return await this.repository.update(id, validated, userId);
    }

    /**
     * Deleta um cliente
     * ATENÇÃO: Delete em CASCADE - remove todas as transações relacionadas
     */
    async deleteClient(id: string): Promise<void> {
        const userId = await getCurrentUserId();
        await this.repository.delete(id, userId);
    }

    /**
     * Busca clientes por nome
     */
    async searchClients(query: string): Promise<Client[]> {
        const userId = await getCurrentUserId();
        return await this.repository.searchByName(userId, query);
    }

    /**
     * Retorna clientes com processos ativos
     */
    async getActiveClients(): Promise<Client[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getClientsWithActiveCases(userId);
    }
}
