'use client';

import { Suspense } from 'react';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OverdueList } from '@/components/dashboard/OverdueList';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-dark-400">Visão geral do seu escritório</p>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardCards />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="skeleton h-96" />}>
                    <RevenueChart />
                </Suspense>

                <Suspense fallback={<div className="skeleton h-96" />}>
                    <OverdueList />
                </Suspense>
            </div>
        </div>
    );
}
