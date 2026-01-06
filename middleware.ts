import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Autenticação
 * Protege rotas do dashboard e redireciona usuários não autenticados para login
 */
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient(
        { req, res },
        {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
    );

    // Verifica se há sessão ativa
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Redirect rotas legadas para a nova estrutura
    if (req.nextUrl.pathname.startsWith('/clientes')) {
        return NextResponse.redirect(new URL('/dashboard/clientes', req.url));
    }
    if (req.nextUrl.pathname.startsWith('/financeiro')) {
        return NextResponse.redirect(new URL('/dashboard/financeiro', req.url));
    }
    if (req.nextUrl.pathname.startsWith('/processos')) {
        return NextResponse.redirect(new URL('/dashboard/processos', req.url));
    }

    // Se usuário não estiver logado e tentar acessar rota protegida
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Se usuário estiver logado e tentar acessar login
    if (session && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/clientes/:path*',
        '/financeiro/:path*',
        '/processos/:path*',
        '/login',
    ],
};
