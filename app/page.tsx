import { redirect } from 'next/navigation';

export default function Home() {
    // Redireciona para dashboard (ou login se não autenticado - middleware cuida disso)
    redirect('/dashboard');
}
