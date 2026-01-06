'use client';

import { PeriodFilter as PeriodFilterType } from '@/types/database.types';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PeriodFilterProps {
    value: PeriodFilterType;
    onChange: (period: PeriodFilterType) => void;
}

const periods: { value: PeriodFilterType; label: string; icon?: React.ComponentType<any> }[] = [
    { value: 'month', label: 'Mês Atual', icon: Calendar },
    { value: '3months', label: 'Últimos 3 Meses', icon: TrendingDown },
    { value: 'year', label: 'Ano Atual', icon: TrendingUp },
    { value: 'all', label: 'Todos', icon: Calendar },
];

/**
 * Filtro de período para transações
 */
export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
    return (
        <div className="card-premium">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Período</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {periods.map((period) => {
                    const Icon = period.icon;

                    return (
                        <button
                            key={period.value}
                            onClick={() => onChange(period.value)}
                            className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200',
                                value === period.value
                                    ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-dark-800 border-dark-700 text-dark-300 hover:bg-dark-700 hover:border-dark-600'
                            )}
                        >
                            {Icon && <Icon className="h-5 w-5" />}
                            <span className="text-sm font-medium">{period.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
