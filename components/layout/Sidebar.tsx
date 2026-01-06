'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    FileText,
    LogOut,
    Scale,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
        { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
        { icon: FileText, label: 'Processos', href: '/dashboard/processos' },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/auth/signout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao sair:', error);
            router.push('/login');
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="p-6 border-b border-dark-800 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg">
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Jurídico</h1>
                            <p className="text-xs text-dark-400">Premium</p>
                        </div>
                    </div>
                    {/* Close Button Mobile */}
                    <button onClick={onClose} className="lg:hidden text-dark-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.href} href={item.href} onClick={onClose}>
                                <div
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-dark-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                    <div className="mt-4 text-xs text-dark-500 text-center">
                        Juris.AI v1.0.0
                    </div>
                </div>
            </aside>
        </>
    );
}
