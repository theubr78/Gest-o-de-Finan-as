/**
 * Formata número de processo no padrão CNJ
 * @param rawNumber - Número sem formatação (apenas dígitos)
 * @returns Número formatado: 0000000-00.0000.0.00.0000
 */
export function formatCNJ(rawNumber: string): string {
    // Remove tudo que não é número
    const numbers = rawNumber.replace(/\D/g, '');

    // Formata no padrão CNJ se tiver 20 dígitos
    if (numbers.length === 20) {
        return numbers.replace(
            /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
            '$1-$2.$3.$4.$5.$6'
        );
    }

    return rawNumber;
}

/**
 * Remove formatação do número CNJ
 * @param formattedNumber - Número formatado
 * @returns Apenas dígitos
 */
export function unformatCNJ(formattedNumber: string): string {
    return formattedNumber.replace(/\D/g, '');
}

/**
 * Valida se o número CNJ está no formato correto
 * @param processNumber - Número de processo
 * @returns true se válido
 */
export function isValidCNJ(processNumber: string): boolean {
    const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
    return pattern.test(processNumber);
}

/**
 * Formata valor monetário para BRL
 * @param value - Valor numérico
 * @returns String formatada (ex: R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Formata WhatsApp para formato internacional
 * @param whatsapp - Número de WhatsApp
 * @returns Número formatado com +55
 */
export function formatWhatsApp(whatsapp: string): string {
    const numbers = whatsapp.replace(/\D/g, '');

    // Se não começar com código do país, adiciona +55 (Brasil)
    if (!whatsapp.startsWith('+')) {
        return `+55${numbers}`;
    }

    return `+${numbers}`;
}

/**
 * Formata data para exibição
 * @param dateString - Data em formato ISO (YYYY-MM-DD)
 * @returns Data formatada (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

/**
 * Converte data de input para formato ISO
 * @param dateString - Data em qualquer formato
 * @returns Data em formato YYYY-MM-DD
 */
export function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Calcula diferença em dias entre duas datas
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em dias
 */
export function daysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se uma data está vencida
 * @param dueDate - Data de vencimento
 * @returns true se vencida
 */
export function isOverdue(dueDate: string): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
}
