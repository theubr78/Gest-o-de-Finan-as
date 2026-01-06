'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Cards do Dashboard com animações Framer Motion
 * Mostra resumo financeiro em tempo real
 */
export function DashboardCards() {
    const { data, isLoading, error } = useDashboardSummary();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                <AlertCircle className="inline mr-2" />
                Erro ao carregar dashboard: {error}
            </div>
        );
    }

    const cards = [
        {
            title: 'Recebido Este Mês',
            value: data?.total_recebido || 0,
            icon: TrendingUp,
            color: 'emerald',
            bgClass: 'bg-emerald-500/10',
            borderClass: 'border-emerald-500/30',
            textClass: 'text-emerald-400',
            iconBgClass: 'bg-emerald-500/20',
        },
        {
            title: 'Previsto Este Mês',
            value: data?.total_previsto || 0,
            icon: Clock,
            color: 'blue',
            bgClass: 'bg-blue-500/10',
            borderClass: 'border-blue-500/30',
            textClass: 'text-blue-400',
            iconBgClass: 'bg-blue-500/20',
        },
        {
            title: 'Em Atraso',
            value: data?.total_atrasado || 0,
            icon: TrendingDown,
            color: 'red',
            bgClass: 'bg-red-500/10',
            borderClass: 'border-red-500/30',
            textClass: 'text-red-400',
            iconBgClass: 'bg-red-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, i) => {
                const Icon = card.icon;

                return (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className={`card-premium ${card.bgClass} border ${card.borderClass} backdrop-blur-sm`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.iconBgClass}`}>
                                <Icon className={`h-6 w-6 ${card.textClass}`} />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-dark-400 mb-1">{card.title}</p>
                            <p className={`text-3xl font-bold ${card.textClass}`}>
                                {formatCurrency(card.value)}
                            </p>
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 pt-4 border-t border-dark-800">
                            <p className="text-xs text-dark-500">Mês atual</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
