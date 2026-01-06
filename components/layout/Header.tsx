'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

/**
 * Header com informações do usuário
 */
export function Header({ onMenuClick }: HeaderProps) {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário');
            }
        };

        loadUser();
    }, []);

    return (
        <header className="h-16 border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors relative">
                    <Bell className="h-5 w-5 text-dark-400" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{userName}</p>
                        <p className="text-xs text-dark-400">Advogado</p>
                    </div>
                    <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
