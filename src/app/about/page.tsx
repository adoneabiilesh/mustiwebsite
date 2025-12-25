import { getAboutPage, getPosts, urlFor, getSiteSettings } from '@/lib/sanity.client';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import AboutClient from '../../components/AboutClient';

export async function generateMetadata(): Promise<Metadata> {
    const about = await getAboutPage();

    return {
        title: about?.seoTitle || 'ABOUT US | LEVEL | THE BOLDEST FOOD DELIVERY & BARS',
        description: about?.seoDescription || 'Experience the boldest food delivery and top-rated bars near you. LEVEL connects you with premium local favorites, high-performance flavors, and lightning-fast service. Best bars and restaurants near you, delivered.',
        keywords: about?.keywords || ['food delivery near me', 'best bars near me', 'restaurant delivery', 'LEVEL food', 'bold flavors', 'local eats delivery', 'premium food delivery'],
        openGraph: {
            title: about?.seoTitle || 'ABOUT US | LEVEL | THE BOLDEST FOOD DELIVERY & BARS',
            description: about?.seoDescription || 'The boldest food delivery and bar experience near you. Find the best bites and drinks from local favorites, delivered fast.',
            images: ['/og-image.jpg'], // Assuming a default OG image exists
        }
    };
}

export default async function AboutPage() {
    const [about, posts, settings] = await Promise.all([
        getAboutPage(),
        getPosts(3),
        getSiteSettings()
    ]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "LEVEL",
        "url": "https://level-delivery.com",
        "logo": "https://level-delivery.com/logo.png",
        "description": "The boldest food delivery service and bar aggregator.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": settings?.address?.split(',')[1]?.trim() || "Miami",
            "addressRegion": settings?.address?.split(',')[2]?.trim() || "FL"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": settings?.phone || "+1-555-0123",
            "contactType": "customer service"
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-20 py-12 px-4 text-dead-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="max-w-4xl mx-auto space-y-12">
                <AboutClient about={about} posts={posts} />
            </section>
        </div>
    );
}
