'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-dark-950">
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <Header />

                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
