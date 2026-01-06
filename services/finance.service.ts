import { TransactionRepository } from '@/repositories/transaction.repository';
import {
    Transaction,
    TransactionWithClient,
    TransactionStatus,
    CreateTransactionDTO,
    RecurringTransactionDTO,
    DashboardSummary,
    RevenueByCategoryView,
    OverduePaymentView,
    PeriodFilter,
} from '@/types/database.types';
import { transactionSchema, recurringTransactionSchema } from '@/lib/validations/schemas';
import { getCurrentUserId, supabase } from '@/lib/supabase/client';
import { addMonths, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';
import { toISODate } from '@/lib/utils/formatters';

/**
 * Service para gerenciamento de Transações Financeiras
 * Inclui lógica de recorrência e cálculo de status
 */
export class FinanceService {
    private repository: TransactionRepository;

    constructor() {
        this.repository = new TransactionRepository();
    }

    /**
     * Cria uma nova transação
     */
    async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
        const validated = transactionSchema.parse(data);
        const userId = await getCurrentUserId();

        return await this.repository.create({
            ...validated,
            user_id: userId,
        });
    }

    /**
     * Cria múltiplas transações recorrentes
     * Ex: Honorários mensais em 12 parcelas
     */
    async createRecurringTransactions(
        data: RecurringTransactionDTO
    ): Promise<Transaction[]> {
        const validated = recurringTransactionSchema.parse(data);
        const userId = await getCurrentUserId();

        const transactions: Transaction[] = [];

        for (let i = 0; i < validated.installments; i++) {
            const dueDate = addMonths(validated.startDate, i);

            const transaction = await this.repository.create({
                client_id: validated.client_id,
                description: `${validated.description} (${i + 1}/${validated.installments})`,
                amount: validated.amount,
                due_date: toISODate(dueDate),
                category: validated.category || 'recorrente',
                user_id: userId,
            });

            transactions.push(transaction);
        }

        return transactions;
    }

    /**
     * Lista todas as transações com dados do cliente
     */
    async listTransactions(): Promise<TransactionWithClient[]> {
        const userId = await getCurrentUserId();
        return await this.repository.getWithClient(userId);
    }

    /**
     * Lista transações por período
     */
    async listTransactionsByPeriod(period: PeriodFilter): Promise<Transaction[]> {
        const userId = await getCurrentUserId();
        const { startDate, endDate } = this.getPeriodDates(period);

        return await this.repository.getByDateRange(
            userId,
            toISODate(startDate),
            toISODate(endDate)
        );
    }

    /**
     * Marca transação como paga
     */
    async markAsPaid(id: string, paymentDate?: string): Promise<Transaction> {
        const userId = await getCurrentUserId();
        const date = paymentDate || toISODate(new Date());

        return await this.repository.markAsPaid(id, userId, date);
    }

    /**
     * Atualiza transação
     */
    async updateTransaction(id: string, data: Partial<CreateTransactionDTO>): Promise<Transaction> {
        const userId = await getCurrentUserId();
        return await this.repository.update(id, data, userId);
    }

    /**
     * Deleta transação
     */
    async deleteTransaction(id: string): Promise<void> {
        const userId = await getCurrentUserId();
        await this.repository.delete(id, userId);
    }

    /**
     * Computa status de uma transação
     */
    computeStatus(transaction: Transaction): TransactionStatus {
        if (transaction.payment_date) return 'PAID';

        const today = new Date();
        const dueDate = new Date(transaction.due_date);

        if (dueDate < today) return 'OVERDUE';
        return 'PENDING';
    }

    /**
     * Retorna resumo do dashboard (via View SQL)
     */
    async getDashboardSummary(): Promise<DashboardSummary> {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('view_dashboard_summary')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // Se não houver dados, retorna zeros
            if (error.code === 'PGRST116') {
                return {
                    user_id: userId,
                    total_recebido: 0,
                    total_previsto: 0,
                    total_atrasado: 0,
                };
            }
            throw error;
        }

        return data;
    }

    /**
     * Retorna receitas por categoria (via View SQL)
     */
    async getRevenueByCategory(): Promise<RevenueByCategoryView[]> {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('view_revenue_by_category')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    }

    /**
     * Retorna pagamentos atrasados (via View SQL)
     */
    async getOverduePayments(): Promise<OverduePaymentView[]> {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('view_overdue_payments')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    }

    /**
     * Helper para calcular datas do filtro de período
     */
    private getPeriodDates(period: PeriodFilter): { startDate: Date; endDate: Date } {
        const now = new Date();

        switch (period) {
            case 'month':
                return {
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now),
                };

            case '3months':
                return {
                    startDate: startOfMonth(subMonths(now, 2)),
                    endDate: endOfMonth(now),
                };

            case 'year':
                return {
                    startDate: startOfYear(now),
                    endDate: endOfYear(now),
                };

            case 'all':
                return {
                    startDate: new Date('2000-01-01'),
                    endDate: new Date('2100-12-31'),
                };

            default:
                return {
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now),
                };
        }
    }
}
