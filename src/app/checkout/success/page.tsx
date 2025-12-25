'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { Check, Package, MapPin, ReceiptText, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

function SuccessContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useCartStore();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyOrder = async () => {
            if (!orderId) return;

            // 1. Update order status to paid in Supabase
            // In a production app, this would be done via a Webhook from SumUp
            const { data, error } = await supabase
                .from('orders')
                .update({ payment_status: 'paid', status: 'confirmed' })
                .eq('id', orderId)
                .select(`
                    *,
                    order_items (*)
                `)
                .single();

            if (!error) {
                setOrder(data);
                clearCart();
            }
            setLoading(false);
        };

        verifyOrder();
    }, [orderId, clearCart]);

    if (loading) {
        return <div className="py-24 text-center font-black uppercase italic animate-pulse">{t('success.verifying')}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center border-4 border-dead-black mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                    <Check className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-7xl font-black uppercase tracking-tighter">{t('success.confirmed')}</h1>
                <p className="text-xl font-bold uppercase text-gray-400">{t('success.order_id')}: <span className="text-dead-black">#{order?.order_number || orderId}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b-2 border-dead-black pb-4">
                        <ReceiptText className="w-6 h-6" />
                        <h2 className="text-2xl font-black uppercase tracking-tight">{t('success.receipt')}</h2>
                    </div>

                    <div className="space-y-4">
                        {order?.order_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-3 border-2 border-dead-black rounded-xl">
                                <span className="font-bold uppercase text-sm">{item.quantity}x {item.menu_item_name}</span>
                                <span className="font-black">{formatPrice(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-gray-200 space-y-2">
                        <div className="flex justify-between font-bold uppercase text-sm text-gray-500">
                            <span>{t('checkout.subtotal')}</span>
                            <span>{formatPrice(order?.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black uppercase tracking-tight pt-2">
                            <span>{t('success.total_paid')}</span>
                            <span className="text-green-600">{formatPrice(order?.total || 0)}</span>
                        </div>
                    </div>
                </Card>

                {/* Logistics */}
                <div className="space-y-8">
                    <Card className="p-8 space-y-6 bg-dead-black text-white">
                        <div className="flex items-center gap-3 border-b-2 border-white/20 pb-4">
                            <MapPin className="w-6 h-6" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">{t('success.delivery_to')}</h2>
                        </div>
                        <p className="text-xl font-bold uppercase italic leading-tight">
                            {order?.delivery_address}
                        </p>
                        <div className="bg-white/10 p-4 rounded-xl">
                            <p className="text-xs font-black uppercase opacity-60">{t('success.status')}</p>
                            <p className="text-lg font-black uppercase">{t('success.preparing')}</p>
                        </div>
                    </Card>

                    <Link href="/profile">
                        <Button variant="primary" size="lg" className="w-full h-16 text-xl flex items-center gap-4">
                            {t('success.view_history')} <ChevronRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    const { t } = useTranslation();
    return (
        <Suspense fallback={<div className="py-24 text-center font-black uppercase">{t('common.loading')}</div>}>
            <SuccessContent />
        </Suspense>
    );
}
