'use client';

import { useEffect, useState } from 'react';
import { FinanceService } from '@/services/finance.service';
import { OverduePaymentView } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { AlertTriangle, MessageCircle, Calendar, User } from 'lucide-react';

/**
 * Lista de pagamentos atrasados
 * Mostra clientes inadimplentes com dados de contato
 */
export function OverdueList() {
    const [payments, setPayments] = useState<OverduePaymentView[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const service = new FinanceService();
        service
            .getOverduePayments()
            .then(setPayments)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="card-premium">
                <div className="skeleton h-96" />
            </div>
        );
    }

    const handleWhatsAppClick = (whatsapp: string | null, clientName: string, amount: number) => {
        if (!whatsapp) return;

        const message = encodeURIComponent(
            `Olá! Este é um lembrete sobre o pagamento de ${formatCurrency(amount)} que está em atraso. Por favor, entre em contato para regularizarmos a situação.`
        );

        window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    return (
        <div className="card-premium">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-bold text-white">Pagamentos em Atraso</h2>
                {payments.length > 0 && (
                    <span className="badge badge-danger">{payments.length}</span>
                )}
            </div>

            {payments.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-dark-400">
                    <AlertTriangle className="h-12 w-12 mb-3 opacity-50" />
                    <p>Nenhum pagamento em atraso</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {payments.map((payment) => (
                        <div
                            key={payment.transaction_id}
                            className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10  transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-red-400" />
                                    <span className="font-semibold text-white">{payment.client_name}</span>
                                </div>
                                <span className="text-lg font-bold text-red-400">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>

                            <p className="text-sm text-dark-300 mb-3">{payment.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                                <div className="flex items-center gap-2 text-xs text-dark-400">
                                    <Calendar className="h-3 w-3" />
                                    <span>Venceu em {formatDate(payment.due_date)}</span>
                                </div>

                                {payment.whatsapp && (
                                    <button
                                        onClick={() =>
                                            handleWhatsAppClick(payment.whatsapp, payment.client_name, payment.amount)
                                        }
                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
                                    >
                                        <MessageCircle className="h-3 w-3" />
                                        Cobrar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
