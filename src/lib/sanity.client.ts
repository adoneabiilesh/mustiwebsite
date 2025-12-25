import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2023-12-23',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}

export async function getAboutPage() {
    return await client.fetch(`*[_type == "about"][0]`);
}

export async function getPosts(limit = 3) {
    return await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...${limit}]`);
}

export async function getSiteSettings() {
    return await client.fetch(`*[_type == "siteSettings"][0]`);
}
