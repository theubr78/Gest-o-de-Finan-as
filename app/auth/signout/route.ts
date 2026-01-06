import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    // Encerra a sessão no servidor (limpa cookies)
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    });
}
