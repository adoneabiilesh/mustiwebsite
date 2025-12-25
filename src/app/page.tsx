import { supabase } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LEVEL Food Delivery | Bold Flavors, Fast Delivery',
  description: 'The boldest food delivery platform. Order burgers, pizza, and craft beer from the best local restaurants. No fluff, just feast.',
  openGraph: {
    title: 'LEVEL Food Delivery',
    description: 'Order from the boldest local restaurants. Fast delivery, high-quality ingredients.',
    type: 'website',
  }
};

export default async function HomePage() {
  // Fetch initial data on the server for better SEO and LCP
  const [catRes, restRes] = await Promise.all([
    supabase.from('categories').select('*').order('order_index'),
    supabase.from('restaurants').select('*').eq('is_active', true),
  ]);

  return (
    <HomeClient
      initialCategories={catRes.data || []}
      initialRestaurants={restRes.data || []}
    />
  );
}
