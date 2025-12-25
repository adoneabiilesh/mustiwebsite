'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Check, ArrowRight, CreditCard, Home, MapPin } from 'lucide-react';
import Link from 'next/link';
import { createSumUpPaymentLink } from '@/lib/sumup';
import { supabase } from '@/lib/supabase';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

export default function CheckoutPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [step, setStep] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [suite, setSuite] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (items.length === 0 && step !== 3) {
        return (
            <div className="py-20 text-center uppercase font-black text-2xl">
                {t('checkout.empty_cart')}
            </div>
        );
    }

    const deliveryFee = 0;
    const tax = getTotal() * 0.1;
    const finalTotal = getTotal() + deliveryFee + tax;


    const handleOrder = async () => {
        if (!address || !zipCode || !phoneNumber) {
            alert(t('checkout.mandatory_fields'));
            return;
        }

        setLoading(true);
        try {
            // 1. Check Auth
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert(t('checkout.login_prompt'));
                router.push('/auth');
                return;
            }

            // 2. Create Order in Supabase (Pending)
            const orderNumber = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: session.user.id,
                    restaurant_id: items[0].restaurant_id, // Assuming items from same restaurant for now
                    order_number: orderNumber,
                    status: 'pending',
                    subtotal: getTotal(),
                    delivery_fee: deliveryFee,
                    tax: tax,
                    total: finalTotal,
                    delivery_address: `${address} ${suite}`.trim(),
                    payment_method: 'Credit Card',
                    payment_status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                menu_item_id: item.menu_item_id,
                menu_item_name: item.menu_item?.name,
                menu_item_price: item.menu_item?.price,
                quantity: item.quantity,
                subtotal: (item.menu_item?.price || 0) * item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 4. Create SumUp Payment Link
            const paymentLink = await createSumUpPaymentLink({
                amount: finalTotal,
                currency: 'EUR',
                checkout_reference: order.id, // Use our internal DB order ID
                description: `Payment for Order ${orderNumber}`,
                return_url: `${window.location.origin}/checkout/success?orderId=${order.id}`
            });

            if (paymentLink.checkout_url) {
                window.location.href = paymentLink.checkout_url;
            } else {
                setStep(3);
                clearCart();
            }
        } catch (error: any) {
            console.error('Order/Payment Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-10">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center border-4 border-dead-black mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-6xl font-black uppercase tracking-tighter">{t('checkout.order_success')}</h1>
                <p className="text-xl font-bold uppercase text-gray-500">
                    {t('checkout.success_desc')}
                </p>
                <Link href="/">
                    <Button variant="primary" size="lg">{t('common.back_to_home')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-center">{t('checkout.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                    {/* Step 1: Address */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-dead-black text-white flex items-center justify-center font-black">1</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">{t('checkout.delivery_info')}</h2>
                        </div>

                        <Card className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">{t('checkout.full_address')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="123 BOLD STREET, FL 33101"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full bg-muted-cream border-2 border-dead-black rounded-2xl py-4 pl-12 pr-4 font-bold uppercase tracking-tight focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">{t('checkout.apt_floor')}</label>
                                    <input
                                        type="text"
                                        placeholder="SUITE 200"
                                        value={suite}
                                        onChange={(e) => setSuite(e.target.value)}
                                        className="w-full bg-muted-cream border-2 border-dead-black rounded-2xl py-4 px-4 font-bold uppercase tracking-tight focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">{t('checkout.zip_code')}</label>
                                    <input
                                        type="text"
                                        placeholder="33101"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        className="w-full bg-muted-cream border-2 border-dead-black rounded-2xl py-4 px-4 font-bold uppercase tracking-tight focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">{t('checkout.phone')}</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">+1</div>
                                    <input
                                        type="tel"
                                        placeholder="555 0123"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-muted-cream border-2 border-dead-black rounded-2xl py-4 pl-12 pr-4 font-bold uppercase tracking-tight focus:outline-none"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-crimson italic">{t('checkout.phone_hint')}</p>
                            </div>
                        </Card>
                    </section>

                    {/* Step 2: Payment */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-dead-black text-white flex items-center justify-center font-black">2</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">{t('checkout.payment')}</h2>
                        </div>

                        <Card className="p-8 space-y-4">
                            <Button variant="outline" className="w-full justify-between h-auto py-5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <CreditCard className="w-6 h-6" />
                                    <span className="text-lg font-black uppercase">{t('checkout.credit_card')}</span>
                                </div>
                                <Check className="w-6 h-6 text-green-500" />
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-auto py-5 rounded-2xl opacity-50 grayscale cursor-not-allowed">
                                <div className="flex items-center gap-4">
                                    <Home className="w-6 h-6" />
                                    <span className="text-lg font-black uppercase">{t('checkout.apple_pay_soon')}</span>
                                </div>
                            </Button>
                        </Card>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <Card className="p-8 sticky top-28 bg-white overflow-hidden">
                        <div className="absolute top-0 right-0 bg-crimson w-16 h-16 transform translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-dead-black"></div>

                        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">{t('checkout.order_recap')}</h2>

                        <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-dead-black text-white flex items-center justify-center text-[10px] font-black">
                                            {item.quantity}
                                        </div>
                                        <span className="font-bold uppercase text-xs tracking-tight line-clamp-1">{item.menu_item?.name}</span>
                                    </div>
                                    <span className="font-black text-xs">{formatPrice((item.menu_item?.price || 0) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between text-base uppercase font-bold tracking-tight text-gray-500">
                                <span>{t('checkout.subtotal')}</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                            <div className="flex justify-between text-base uppercase font-bold tracking-tight text-gray-500">
                                <span>{t('checkout.tax')} (10%)</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div className="flex justify-between text-base uppercase font-bold tracking-tight text-gray-500">
                                <span>{t('checkout.delivery')}</span>
                                <span className="text-green-600">{t('checkout.free')}</span>
                            </div>
                            <div className="pt-6 border-t-4 border-dead-black flex justify-between">
                                <span className="text-3xl font-black uppercase tracking-tight">{t('checkout.total')}</span>
                                <span className="text-3xl font-black uppercase tracking-tight">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleOrder}
                            variant="crimson"
                            size="lg"
                            className="w-full text-xl py-8"
                            disabled={loading}
                        >
                            {loading ? t('checkout.processing') : t('checkout.order_pay_now')}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
