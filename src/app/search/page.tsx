import SearchClient from '@/components/SearchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search | LEVEL',
    description: 'Find your next favorite meal on LEVEL.',
};

export default function SearchPage() {
    return <SearchClient />;
}
