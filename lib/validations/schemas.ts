import { z } from 'zod';

/**
 * Schema de validação para Cliente
 * Garante que dados estejam no formato correto antes de salvar no banco
 */
export const clientSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(255, 'Nome muito longo'),

    whatsapp: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'WhatsApp inválido. Use formato internacional (ex: +5511999999999)')
        .optional()
        .nullable()
        .or(z.literal('')),
});

/**
 * Schema para número de processo CNJ
 * Formato: 0000000-00.0000.0.00.0000
 */
export const processNumberSchema = z.string()
    .regex(
        /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/,
        'Formato CNJ inválido. Use: 0000000-00.0000.0.00.0000'
    )
    .optional()
    .nullable()
    .or(z.literal(''));

/**
 * Schema para Case/Processo
 */
export const caseSchema = z.object({
    client_id: z.string().uuid('ID de cliente inválido'),

    process_number: processNumberSchema,

    description: z.string()
        .max(1000, 'Descrição muito longa')
        .optional()
        .nullable(),

    status: z.string()
        .default('Ativo')
        .optional(),
});

/**
 * Schema para Transaction
 */
export const transactionSchema = z.object({
    client_id: z.string().uuid('ID de cliente inválido'),

    case_id: z.string().uuid('ID de processo inválido')
        .optional()
        .nullable(),

    description: z.string()
        .min(3, 'Descrição muito curta')
        .max(500, 'Descrição muito longa'),

    amount: z.number()
        .positive('Valor deve ser positivo')
        .max(9999999999999.99, 'Valor muito alto'),

    due_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use formato YYYY-MM-DD'),

    payment_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use formato YYYY-MM-DD')
        .optional()
        .nullable(),

    category: z.enum(['honorarios', 'recorrente', 'exito', 'custas'], {
        errorMap: () => ({ message: 'Categoria inválida' }),
    }),
});

/**
 * Schema para lançamentos recorrentes
 */
export const recurringTransactionSchema = z.object({
    client_id: z.string().uuid('ID de cliente inválido'),

    description: z.string()
        .min(3, 'Descrição muito curta'),

    amount: z.number()
        .positive('Valor deve ser positivo'),

    startDate: z.coerce.date({
        required_error: 'Data de início é obrigatória',
    }),

    installments: z.number()
        .int('Número de parcelas deve ser inteiro')
        .min(2, 'Mínimo de 2 parcelas')
        .max(120, 'Máximo de 120 parcelas'),

    category: z.enum(['honorarios', 'recorrente', 'exito', 'custas'])
        .default('recorrente'),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type CaseFormData = z.infer<typeof caseSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type RecurringTransactionFormData = z.infer<typeof recurringTransactionSchema>;
