import { defineField, defineType } from 'sanity';

export const aboutType = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            description: 'Title for search engines (e.g. Best Bar/Restaurant Near Me)',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            description: 'Description for search engines.',
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
    ],
});
