import { getSiteSettings } from '@/lib/sanity.client';
import ContactClient from '@/components/ContactClient';

export default async function ContactPage() {
    const settings = await getSiteSettings();

    return <ContactClient settings={settings} />;
}
