import { Star, Clock, Bike } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Restaurant } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const { t } = useTranslation();
    return (
        <Link href={`/restaurant/${restaurant.slug}`}>
            <Card hoverable className="h-full overflow-hidden flex flex-col">
                <div className="relative h-48 w-full border-b-2 border-dead-black bg-muted-cream">
                    {restaurant.image_url ? (
                        <Image
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">
                            {t('common.no_image')}
                        </div>
                    )}
                    {restaurant.is_featured && (
                        <div className="absolute top-4 left-4 bg-crimson text-white px-3 py-1 rounded-full border-2 border-dead-black text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {t('restaurant.featured')}
                        </div>
                    )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight">
                                {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-white border-2 border-dead-black px-2 py-0.5 rounded-full text-xs font-black">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {restaurant.rating}
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 uppercase font-medium tracking-tight mb-4">
                            {restaurant.description || t('restaurant.default_description')}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-crimson" />
                            <span className="text-xs font-black uppercase tracking-tight">
                                {restaurant.delivery_time_min} {t('common.min')}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bike className="w-4 h-4 text-crimson" />
                            <span className="text-xs font-black uppercase tracking-tight">
                                {restaurant.delivery_fee === 0 ? t('restaurant.free') : formatPrice(restaurant.delivery_fee)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
