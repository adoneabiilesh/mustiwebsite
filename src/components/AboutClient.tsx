'use client';

import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';

export default function AboutClient({ about, posts }: { about: any; posts: any[] }) {
    const { t, language } = useTranslation();

    return (
        <div className="space-y-20">
            <section className="max-w-4xl mx-auto space-y-12">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-center">
                    {about?.title || t('about.title')}
                </h1>

                <Card className="p-10 bg-white">
                    <div className="prose prose-xl max-w-none font-bold uppercase tracking-tight text-dead-black leading-relaxed text-center md:text-left">
                        <div className="space-y-6">
                            <p>{t('about.story_p1')}</p>
                            <p>{t('about.story_p2')}</p>
                            <p>{t('about.story_p3')}</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Blog Posts Integration */}
            <section className="space-y-10">
                <div className="flex items-center gap-6 justify-center md:justify-start">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">{t('about.latest_blog')}</h2>
                    <div className="h-2 flex-1 bg-dead-black hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts && posts.length > 0 ? (
                        posts.map((post: any) => (
                            <Card key={post._id} className="group overflow-hidden flex flex-col h-full bg-white hover:rotate-1 transition-transform">
                                {post.mainImage && (
                                    <div className="relative aspect-video border-b-2 border-dead-black overflow-hidden bg-muted-cream">
                                        <Image
                                            src={urlFor(post.mainImage).url()}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-crimson transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US') : t('common.just_now')}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="inline-block bg-dead-black text-white px-4 py-2 font-black uppercase text-xs tracking-widest group-hover:bg-crimson transition-colors">
                                            {t('about.read_more')}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-200 rounded-[32px]">
                            <p className="text-xl font-black uppercase text-gray-300 tracking-tighter italic">{t('about.no_stories')}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-crimson border-4 border-dead-black p-8 rounded-[32px] shadow-neo text-white">
                    <h2 className="text-3xl font-black uppercase mb-4 italic">{t('about.for_bars')}</h2>
                    <p className="font-bold uppercase text-sm tracking-widest">{t('about.for_bars_desc')}</p>
                </div>
                <div className="bg-white border-4 border-dead-black p-8 rounded-[32px] shadow-neo text-dead-black">
                    <h2 className="text-3xl font-black uppercase mb-4 italic">{t('about.for_foodies')}</h2>
                    <p className="font-bold uppercase text-sm tracking-widest">{t('about.for_foodies_desc')}</p>
                </div>
            </section>
        </div>
    );
}
