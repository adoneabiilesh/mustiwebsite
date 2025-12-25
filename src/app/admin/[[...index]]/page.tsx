'use client';

/**
 * This route is responsible for rendering the Sanity Studio.
 * It uses the 'next-sanity/studio' component to embed the studio in your Next.js app.
 */

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
    return <NextStudio config={config} />;
}
