import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'email',
            title: 'Support Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'phone',
            title: 'Support Phone',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'address',
            title: 'Our Spot (Address)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
    ],
});
