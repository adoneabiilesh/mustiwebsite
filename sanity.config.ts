import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
    name: 'default',
    title: 'Food Delivery CMS',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    basePath: '/admin',

    plugins: [deskTool()],

    schema: {
        types: schemaTypes,
    },
});
