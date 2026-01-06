'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FinanceService } from '@/services/finance.service';
import { RevenueByCategoryView } from '@/types/database.types';
import { formatCurrency } from '@/lib/utils/formatters';
import { TrendingUp } from 'lucide-react';

const COLORS = {
    honorarios: '#10b981', // emerald
    recorrente: '#3b82f6', // blue
    exito: '#f59e0b', // amber
    custas: '#8b5cf6', // purple
};

const CATEGORY_LABELS = {
    honorarios: 'Honorários',
    recorrente: 'Recorrente',
    exito: 'Êxito',
    custas: 'Custas',
};

/**
 * Gráfico de Pizza - Receitas por Categoria
 * Usa Recharts para visualização premium
 */
export function RevenueChart() {
    const [data, setData] = useState<RevenueByCategoryView[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const service = new FinanceService();
        service
            .getRevenueByCategory()
            .then(setData)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="card-premium">
                <div className="skeleton h-96" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="card-premium">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="h-5 w-5 text-primary-400" />
                    <h2 className="text-xl font-bold text-white">Receitas por Categoria</h2>
                </div>
                <div className="h-64 flex items-center justify-center text-dark-400">
                    Nenhuma receita registrada
                </div>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS] || item.category,
        value: item.total_amount,
        color: COLORS[item.category as keyof typeof COLORS] || '#6b7280',
    }));

    const total = data.reduce((sum, item) => sum + item.total_amount, 0);

    return (
        <div className="card-premium">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary-400" />
                    <h2 className="text-xl font-bold text-white">Receitas por Categoria</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-dark-400">Total</p>
                    <p className="text-lg font-bold text-primary-400">{formatCurrency(total)}</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-dark-300">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Summary List */}
            <div className="mt-6 space-y-2">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-dark-300">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{formatCurrency(item.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
