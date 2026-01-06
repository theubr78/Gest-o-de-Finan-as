'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    FileText,
    Menu,
    X,
    LogOut,
    Scale,
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

/**
 * Sidebar Premium com navegação
 * Responsiva: Desktop (Fixed) → Mobile (Drawer)
 */
export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClientComponentClient();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
        { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
        { icon: FileText, label: 'Processos', href: '/dashboard/processos' },
    ];

    const handleLogout = async () => {
        try {
            // Chama a rota de servidor que limpa os cookies
            await fetch('/auth/signout', { method: 'POST' });

            // Força recarregamento total para página de login
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao sair:', error);
            // Fallback
            router.push('/login');
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-dark-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg">
                        <Scale className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Jurídico</h1>
                        <p className="text-xs text-dark-400">Premium</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
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

            {/* Logout Button */}
            <div className="p-4 border-t border-dark-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-900 rounded-lg border border-dark-800"
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-800">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-dark-900 border-r border-dark-800 z-50"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
