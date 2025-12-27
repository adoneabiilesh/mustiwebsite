'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

export default function AuthPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success(t('auth.verification_sent'), {
                    description: "CHECK YOUR INBOX TO LEVEL UP YOUR ACCOUNT."
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("WELCOME BACK TO LEVEL", {
                    description: "AUTHENTICATION SECURED."
                });
                router.push('/');
            }
        } catch (error: any) {
            toast.error("AUTHENTICATION FAILED", {
                description: error.message.toUpperCase()
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isSignUp ? t('auth.create_account') : t('auth.welcome_back')}</CardTitle>
                    <CardDescription>
                        {isSignUp ? t('auth.join_community') : t('auth.login_fuel')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-black">{t('auth.email')}</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border-2 border-dead-black rounded-full px-6 py-3 font-bold uppercase text-base focus:outline-none focus:ring-2 focus:ring-crimson/20"
                                placeholder="YOU@EXAMPLE.COM"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-black">{t('auth.password')}</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border-2 border-dead-black rounded-full px-6 py-3 font-bold uppercase text-base focus:outline-none focus:ring-2 focus:ring-crimson/20"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button variant="crimson" className="w-full h-14 text-lg" disabled={loading}>
                            {loading ? t('auth.processing') : isSignUp ? t('auth.sign_up') : t('auth.sign_in')}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="w-full text-xs font-black uppercase tracking-widest text-dead-black hover:underline"
                        >
                            {isSignUp ? t('auth.already_have_account') : t('auth.no_account')}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
