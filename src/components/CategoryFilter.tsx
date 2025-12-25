'use client';

import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
    const { t } = useTranslation();
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <button
                onClick={() => onSelect(null)}
                className={cn(
                    'flex-shrink-0 px-6 py-2 rounded-full border-2 border-dead-black font-black uppercase tracking-tight transition-all',
                    selectedCategory === null
                        ? 'bg-crimson text-white shadow-none translate-x-[2px] translate-y-[2px]'
                        : 'bg-white text-dead-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                )}
            >
                {t('common.all')}
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.slug)}
                    className={cn(
                        'flex-shrink-0 px-6 py-2 rounded-full border-2 border-dead-black font-black uppercase tracking-tight transition-all',
                        selectedCategory === category.slug
                            ? 'bg-crimson text-white shadow-none translate-x-[2px] translate-y-[2px]'
                            : 'bg-white text-dead-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    )}
                >
                    {t(`categories.${category.slug}`) !== `categories.${category.slug}` ? t(`categories.${category.slug}`) : category.name}
                </button>
            ))}
        </div>
    );
}
