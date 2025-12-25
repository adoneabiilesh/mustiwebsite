import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import RestaurantDetail from '@/components/RestaurantDetail';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

// Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('name, description, image_url')
        .eq('slug', slug)
        .single();

    if (!restaurant) return { title: 'Restaurant Not Found' };

    return {
        title: `${restaurant.name} | LEVEL Food Delivery`,
        description: restaurant.description || `Order from ${restaurant.name} on LEVEL. Fast delivery and bold flavors.`,
        openGraph: {
            title: restaurant.name,
            description: restaurant.description,
            images: restaurant.image_url ? [restaurant.image_url] : [],
            type: 'website',
        },
    };
}

export default async function RestaurantPage({ params }: Props) {
    const { slug } = await params;

    // Fetch data on the server for SEO and performance
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!restaurant) {
        notFound();
    }

    const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_available', true)
        .order('order_index');

    // JSON-LD Structured Data for Google (Product/Menu)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: restaurant.name,
        image: restaurant.image_url,
        description: restaurant.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: restaurant.address,
        },
        hasMenu: {
            '@type': 'Menu',
            hasMenuItem: menuItems?.map(item => ({
                '@type': 'MenuItem',
                name: item.name,
                description: item.description,
                offers: {
                    '@type': 'Offer',
                    price: item.price,
                    priceCurrency: 'EUR',
                },
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RestaurantDetail restaurant={restaurant} menuItems={menuItems || []} />
        </>
    );
}
