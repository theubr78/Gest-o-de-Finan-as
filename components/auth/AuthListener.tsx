'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function AuthListener() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                router.refresh(); // Atualiza os cookies do servidor
            }
            if (event === 'SIGNED_OUT') {
                router.push('/login');
                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return null;
}
