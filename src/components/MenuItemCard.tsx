'use client';

import { MenuItem } from '@/lib/types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

interface MenuItemProps {
    item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemProps) {
    const { t } = useTranslation();
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        addItem(item);
        toast.success(`${item.name.toUpperCase()} ADDED TO CART`, {
            description: "YOUR BOLD CHOICE HAS BEEN SECURED."
        });
    };

    return (
        <Card className="flex overflow-hidden group" itemScope itemType="https://schema.org/MenuItem">
            <div className="flex-1 p-5">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-1" itemProp="name">
                            {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-medium uppercase leading-tight" itemProp="description">
                            {item.description}
                        </p>
                    </div>
                    <div className="text-crimson font-black text-xl flex-shrink-0" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span itemProp="price" content={item.price.toString()}>{formatPrice(item.price)}</span>
                        <meta itemProp="priceCurrency" content="EUR" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    {item.calories && (
                        <span className="text-[10px] font-black uppercase text-gray-400 border-2 border-gray-200 px-2 py-0.5 rounded-full" itemProp="nutrition" itemScope itemType="https://schema.org/NutritionInformation">
                            <span itemProp="calories">{item.calories} {t('common.calories')}</span>
                        </span>
                    )}
                    <Button
                        onClick={handleAdd}
                        variant="primary"
                        size="sm"
                        className="rounded-full gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('common.add')}
                    </Button>
                </div>
            </div>

            {item.image_url && (
                <div className="relative w-32 h-32 md:w-40 md:h-full border-l-2 border-dead-black bg-muted-cream">
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        itemProp="image"
                    />
                </div>
            )}
        </Card>
    );
}
