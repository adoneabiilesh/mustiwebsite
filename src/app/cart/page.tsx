'use client';

import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-muted-cream rounded-full flex items-center justify-center border-4 border-dead-black mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Bag is Empty</h2>
                <p className="text-xl font-bold uppercase text-gray-500 mb-10">Time to fill it with something bold.</p>
                <Link href="/">
                    <Button variant="primary" size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter">Your Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <Card key={item.id} className="p-6">
                            <div className="flex gap-6">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dead-black flex-shrink-0 bg-muted-cream">
                                    {item.menu_item?.image_url ? (
                                        <Image
                                            src={item.menu_item.image_url}
                                            alt={item.menu_item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-gray-400">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">{item.menu_item?.name}</h3>
                                            <p className="text-sm font-bold text-crimson uppercase tracking-tight">
                                                {formatPrice(item.menu_item?.price || 0)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-dead-black transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-4 bg-muted-cream border-2 border-dead-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-dead-black hover:bg-ivory active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-black">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-dead-black hover:bg-ivory active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xl font-black uppercase tracking-tight">
                                            {formatPrice((item.menu_item?.price || 0) * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div>
                    <Card className="p-8 sticky top-28 bg-white">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-lg uppercase font-bold tracking-tight">
                                <span>Subtotal</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                            <div className="flex justify-between text-lg uppercase font-bold tracking-tight">
                                <span>Delivery</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="pt-4 border-t-4 border-dead-black flex justify-between">
                                <span className="text-2xl font-black uppercase tracking-tight">Total</span>
                                <span className="text-2xl font-black uppercase tracking-tight">{formatPrice(getTotal())}</span>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <Button variant="crimson" size="lg" className="w-full gap-4">
                                Checkout Now
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </Link>

                        <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase text-center tracking-widest leading-relaxed">
                            Taxes and other fees calculated at checkout. By proceeding, you agree to our terms of service.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
