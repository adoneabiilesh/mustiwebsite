'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category, Restaurant, MenuItem } from '@/lib/types';
import CategoryFilter from '@/components/CategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import MenuItemCard from '@/components/MenuItemCard';
import { useTranslation } from '@/lib/i18n';

interface HomeClientProps {
    initialCategories: Category[];
    initialRestaurants: Restaurant[];
}

export default function HomeClient({ initialCategories, initialRestaurants }: HomeClientProps) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [matchingItems, setMatchingItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);

    useEffect(() => {
        async function fetchMatchingItems() {
            if (!selectedCategory) {
                setMatchingItems([]);
                return;
            }

            setLoadingItems(true);
            const cat = categories.find(c => c.slug === selectedCategory);
            if (cat) {
                const { data } = await supabase
                    .from('menu_items')
                    .select('*, restaurants(*)')
                    .eq('category', cat.name)
                    .eq('is_available', true)
                    .limit(10);

                setMatchingItems(data || []);
            }
            setLoadingItems(false);
        }
        fetchMatchingItems();
    }, [selectedCategory, categories]);

    const filteredRestaurants = selectedCategory
        ? restaurants.filter((r) => {
            const category = categories.find(c => c.slug === selectedCategory);
            // Check direct linkage or if any matching items were found for this restaurant
            const hasLink = r.category_id === category?.id;
            const hasItems = matchingItems.some(item => item.restaurant_id === r.id);
            return hasLink || hasItems;
        })
        : restaurants;

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Hero Section */}
            <section className="bg-crimson border-4 border-dead-black p-6 md:p-10 rounded-[28px] md:rounded-[32px] shadow-neo-lg text-white">
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight md:leading-none mb-4 md:mb-6">
                    {t('home.hero_title')}
                </h1>
                <p className="text-lg md:text-xl font-bold uppercase tracking-tight max-w-xl opacity-90">
                    {t('home.hero_subtitle')}
                </p>
            </section>

            {/* Category Filter */}
            <section>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-6">{t('home.categories')}</h2>
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </section>

            {/* Restaurants Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight">{t('home.all_restaurants')}</h2>
                    <div className="bg-white border-2 border-dead-black px-4 py-1.5 rounded-full font-black text-sm uppercase">
                        {loading ? '0' : filteredRestaurants.length} {t('nav.restaurants')}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 bg-muted-cream rounded-[24px] animate-pulse border-2 border-dead-black" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </section>

            {/* Selected Category Items Section */}
            {selectedCategory && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black uppercase tracking-tight">
                            {(() => {
                                const cat = categories.find(c => c.slug === selectedCategory);
                                const localizedName = cat ? (t(`categories.${cat.slug}`) !== `categories.${cat.slug}` ? t(`categories.${cat.slug}`) : cat.name) : '';
                                return t('home.best_picks', { category: localizedName });
                            })()}
                        </h2>
                    </div>

                    {loadingItems ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="h-32 bg-muted-cream rounded-2xl animate-pulse border-2 border-dead-black" />
                            ))}
                        </div>
                    ) : matchingItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {matchingItems.map(item => (
                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center border-4 border-dashed border-gray-200 rounded-[32px] font-bold uppercase text-gray-400">
                            {t('home.no_items')}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
