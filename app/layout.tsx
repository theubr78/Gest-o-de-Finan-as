import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthListener } from '@/components/auth/AuthListener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Sistema Jurídico Premium',
    description: 'Gestão financeira e de processos para advogados',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
            <body className="bg-background min-h-screen text-foreground antialiased selection:bg-primary/20 selection:text-primary">
                <AuthListener />
                {children}
            </body>
        </html>
    );
}
