'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Utensils, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Restaurant, MenuItem } from '@/lib/types';
import RestaurantCard from '@/components/RestaurantCard';
import MenuItemCard from '@/components/MenuItemCard';
import { useTranslation } from '@/lib/i18n';
import { Button } from './ui/Button';

export default function SearchClient() {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [menuItems, setMenuItems] = useState<(MenuItem & { restaurants: Restaurant })[]>([]);
    const [initialItems, setInitialItems] = useState<(MenuItem & { restaurants: Restaurant })[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialItems = async () => {
            const { data } = await supabase
                .from('menu_items')
                .select('*, restaurants(*)')
                .eq('is_available', true)
                .limit(6);
            if (data) setInitialItems(data as any);
        };
        fetchInitialItems();
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setRestaurants([]);
                setMenuItems([]);
                return;
            }

            setLoading(true);

            // Search restaurants
            const { data: restData } = await supabase
                .from('restaurants')
                .select('*')
                .ilike('name', `%${query}%`)
                .eq('is_active', true)
                .limit(10);

            // Search menu items
            const { data: itemData } = await supabase
                .from('menu_items')
                .select('*, restaurants(*)')
                .ilike('name', `%${query}%`)
                .eq('is_available', true)
                .limit(10);

            setRestaurants(restData || []);
            setMenuItems((itemData as any) || []);
            setLoading(false);
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="space-y-8 pb-12">
            <div className="sticky top-20 z-40 bg-ivory pb-4 -mx-4 px-4 pt-2">
                <div className="relative">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('search.placeholder')}
                        autoFocus
                        className="w-full bg-white border-4 border-dead-black rounded-[24px] py-6 pl-16 pr-14 font-black uppercase text-xl shadow-neo focus:outline-none focus:ring-4 focus:ring-crimson/10 transition-all placeholder:text-gray-300"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-cream rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-tight text-gray-400">{t('home.searching')}</p>
                </div>
            ) : query.length >= 2 ? (
                <div className="space-y-12">
                    {restaurants.length === 0 && menuItems.length === 0 ? (
                        <div className="text-center py-20 border-4 border-dashed border-gray-200 rounded-[32px] p-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                                {t('search.no_results', { query })}
                            </h3>
                            <p className="font-bold text-gray-400 uppercase">
                                {t('search.try_another')}
                            </p>
                        </div>
                    ) : (
                        <>
                            {restaurants.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="w-6 h-6 text-crimson" />
                                        <h2 className="text-3xl font-black uppercase tracking-tight">{t('search.restaurants')}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {restaurants.map((restaurant) => (
                                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {menuItems.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Utensils className="w-6 h-6 text-crimson" />
                                        <h2 className="text-3xl font-black uppercase tracking-tight">{t('search.items')}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {menuItems.map((item) => (
                                            <MenuItemCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {initialItems.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Utensils className="w-6 h-6 text-crimson" />
                                <h2 className="text-3xl font-black uppercase tracking-tight">Popular Picks</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {initialItems.map((item) => (
                                    <MenuItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    )}
                    <div className="text-center py-10 opacity-20 select-none hidden md:block">
                        <SearchIcon className="w-32 h-32 mx-auto mb-4" />
                        <p className="text-4xl font-black uppercase tracking-tighter italic">Ready for your level</p>
                    </div>
                </div>
            )}
        </div>
    );
}
