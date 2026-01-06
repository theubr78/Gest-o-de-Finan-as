'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.refresh();
                router.push('/dashboard');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        },
                    },
                });
                if (error) throw error;
                setError('Conta criada! Verifique seu email para confirmar.');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao processar solicitação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
            <div className="card-premium w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gradient mb-2">
                        Sistema Jurídico Premium
                    </h1>
                    <p className="text-dark-400">Gestão Financeira para Advogados</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-premium w-full"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-premium w-full"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="w-full text-center text-sm text-dark-400 hover:text-primary-400 transition-colors"
                    >
                        {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
