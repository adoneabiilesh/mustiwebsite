'use client';

import { Restaurant, MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Star, Clock, Bike, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MenuItemCard from '@/components/MenuItemCard';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface RestaurantDetailProps {
    restaurant: Restaurant;
    menuItems: MenuItem[];
}

export default function RestaurantDetail({ restaurant, menuItems }: RestaurantDetailProps) {
    const { t } = useTranslation();
    // Group menu items by category if available
    const categories = Array.from(new Set(menuItems.map(item => item.category || 'Main Menu')));

    return (
        <div className="space-y-8 pb-12">
            <Link href="/">
                <Button variant="outline" size="sm" className="gap-2 rounded-full mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    {t('common.back_to_list')}
                </Button>
            </Link>

            {/* Hero */}
            <div className="relative h-64 md:h-96 w-full rounded-[32px] overflow-hidden border-4 border-dead-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-muted-cream">
                {restaurant.cover_image_url || restaurant.image_url ? (
                    <Image
                        src={restaurant.cover_image_url || restaurant.image_url || ''}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                    />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-white border-2 border-dead-black px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {restaurant.rating} ({restaurant.review_count})
                                </div>
                                {restaurant.is_featured && (
                                    <div className="bg-crimson text-white border-2 border-dead-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {t('restaurant.featured')}
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                                {restaurant.name}
                            </h1>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white border-2 border-dead-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                                <Clock className="w-5 h-5 text-crimson mb-1" />
                                <span className="text-[10px] font-black uppercase text-gray-400">{t('restaurant.wait_time')}</span>
                                <span className="text-base font-black uppercase">{restaurant.delivery_time_min}M</span>
                            </div>
                            <div className="bg-white border-2 border-dead-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                                <Bike className="w-5 h-5 text-crimson mb-1" />
                                <span className="text-[10px] font-black uppercase text-gray-400">{t('restaurant.delivery')}</span>
                                <span className="text-base font-black uppercase">{restaurant.delivery_fee === 0 ? t('restaurant.free') : formatPrice(restaurant.delivery_fee)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <div className="lg:col-span-2 space-y-12">
                    {categories.map(cat => (
                        <section key={cat}>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8 border-b-4 border-dead-black inline-block">
                                {cat}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                                {menuItems
                                    .filter(item => (item.category || 'Main Menu') === cat)
                                    .map(item => (
                                        <MenuItemCard key={item.id} item={item} />
                                    ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-28 bg-white border-2 border-dead-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-6">{t('restaurant.about')}</h3>
                        <p className="font-medium text-gray-600 uppercase text-sm leading-relaxed mb-8">
                            {restaurant.description || t('restaurant.no_description')}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted-cream flex items-center justify-center border-2 border-dead-black">
                                    <Bike className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-gray-400">{t('restaurant.address')}</div>
                                    <div className="text-sm font-black uppercase">{restaurant.address}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
