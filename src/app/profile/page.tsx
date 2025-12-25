'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function ProfilePage() {
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/auth');
                return;
            }

            setUser(session.user);

            const { data: ordersData, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    restaurants (name)
                `)
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (!error) {
                setOrders(ordersData || []);
            }
            setLoading(false);
        };

        fetchUserAndOrders();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return <div className="py-20 text-center font-black uppercase italic">LOADING YOUR PROFILE...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black uppercase tracking-tighter italic">{t('profile.title')}</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-tight flex items-center gap-2">
                        <User className="w-4 h-4" /> {user?.email}
                    </p>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2 border-crimson text-crimson hover:bg-crimson hover:text-white">
                    <LogOut className="w-4 h-4" /> {t('profile.sign_out')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Account Summary */}
                <Card className="p-8 space-y-8 h-fit bg-ivory">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{t('profile.account_stats')}</h2>
                    <div className="space-y-4">
                        <div className="bg-white border-2 border-dead-black p-4 rounded-2xl flex justify-between items-center">
                            <span className="font-black uppercase text-xs text-gray-400">{t('profile.total_orders')}</span>
                            <span className="text-2xl font-black">{orders.length}</span>
                        </div>
                        <div className="bg-white border-2 border-dead-black p-4 rounded-2xl flex justify-between items-center">
                            <span className="font-black uppercase text-xs text-gray-400">LEVEL STATUS</span>
                            <span className="text-2xl font-black text-crimson italic">BOLD BAE</span>
                        </div>
                    </div>
                </Card>

                {/* Orders List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4">
                        <Package className="w-8 h-8" />
                        <h2 className="text-3xl font-black uppercase tracking-tight">{t('profile.order_history')}</h2>
                    </div>

                    <div className="space-y-6">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <Card key={order.id} className="p-6 transition-transform hover:-translate-y-1">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-dead-black rounded-full ${order.status === 'delivered' ? 'bg-green-400' : 'bg-yellow-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                                {order.restaurants?.name || 'MULTIPLE RESTAURANTS'}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase">
                                                ID: <span className="text-dead-black">{order.order_number}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-row md:flex-col justify-between items-end gap-2">
                                            <span className="text-3xl font-black italic">{formatPrice(order.total)}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'text-green-600' : 'text-crimson'
                                                }`}>
                                                PAYMENT: {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="py-20 text-center border-4 border-dashed border-gray-200 rounded-[32px]">
                                <p className="text-gray-300 font-black uppercase text-xl italic tracking-tighter">{t('profile.no_orders')}</p>
                                <Link href="/">
                                    <Button variant="primary" className="mt-6">START BROWSING</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
