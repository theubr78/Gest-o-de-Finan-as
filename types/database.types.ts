// ==========================================
// DATABASE TYPES - Baseado no Schema SQL
// ==========================================

export interface Client {
    id: string;
    user_id: string;
    name: string;
    whatsapp: string | null;
    created_at: string;
}

export interface CaseModel {
    id: string;
    user_id: string;
    client_id: string;
    process_number: string | null;
    description: string | null;
    status: string;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    client_id: string;
    case_id: string | null;
    description: string;
    amount: number; // numeric(15,2)
    due_date: string;
    payment_date: string | null;
    category: 'honorarios' | 'recorrente' | 'exito' | 'custas';
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string | null;
    updated_at: string;
}

// ==========================================
// COMPUTED TYPES
// ==========================================

export type TransactionStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface TransactionWithClient extends Transaction {
    client: Pick<Client, 'id' | 'name' | 'whatsapp'>;
}

export interface TransactionWithStatus extends Transaction {
    status: TransactionStatus;
}

// ==========================================
// VIEW TYPES (SQL Views)
// ==========================================

export interface DashboardSummary {
    user_id: string;
    total_recebido: number;
    total_previsto: number;
    total_atrasado: number;
}

export interface RevenueByCategoryView {
    user_id: string;
    category: string;
    total_amount: number;
}

export interface OverduePaymentView {
    user_id: string;
    transaction_id: string;
    client_name: string;
    whatsapp: string | null;
    description: string;
    amount: number;
    due_date: string;
}

// ==========================================
// DTO TYPES (Data Transfer Objects)
// ==========================================

export interface CreateClientDTO {
    name: string;
    whatsapp?: string | null;
}

export interface UpdateClientDTO {
    name?: string;
    whatsapp?: string | null;
}

export interface CreateTransactionDTO {
    client_id: string;
    case_id?: string | null;
    description: string;
    amount: number;
    due_date: string;
    payment_date?: string | null;
    category: 'honorarios' | 'recorrente' | 'exito' | 'custas';
}

export interface RecurringTransactionDTO {
    baseTransaction: Omit<CreateTransactionDTO, 'due_date'>;
    startDate: Date;
    installments: number;
}

export interface CreateCaseDTO {
    client_id: string;
    process_number?: string | null;
    description?: string | null;
    status?: string;
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type PeriodFilter = 'month' | '3months' | 'year' | 'all';

export interface DateRange {
    start: Date;
    end: Date;
}

// ==========================================
// SUPABASE DATABASE TYPE
// ==========================================

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'id'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            clients: {
                Row: Client;
                Insert: Omit<Client, 'id' | 'created_at'>;
                Update: Partial<Omit<Client, 'id' | 'created_at'>>;
            };
            cases: {
                Row: CaseModel;
                Insert: Omit<CaseModel, 'id' | 'created_at'>;
                Update: Partial<Omit<CaseModel, 'id' | 'created_at'>>;
            };
            transactions: {
                Row: Transaction;
                Insert: Omit<Transaction, 'id' | 'created_at'>;
                Update: Partial<Omit<Transaction, 'id' | 'created_at'>>;
            };
        };
        Views: {
            view_dashboard_summary: {
                Row: DashboardSummary;
            };
            view_revenue_by_category: {
                Row: RevenueByCategoryView;
            };
            view_overdue_payments: {
                Row: OverduePaymentView;
            };
        };
    };
}
