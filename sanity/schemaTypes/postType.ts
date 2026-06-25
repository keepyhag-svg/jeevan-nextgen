import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title (Assamese)',
      type: 'string',
    }),
    defineField({
      name: 'englishTitle',
      title: 'English Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Categories (Tags)',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
      description: 'Select tags like Tech, History, Literature, etc.',
    }),
    // 🚀 NEW UPGRADE: The Recommendation Switch
    defineField({
      name: 'isFeatured',
      title: 'Top Rated / Featured Article',
      type: 'boolean',
      description: 'Turn this ON to automatically show this article to new guests on the "For You" page.',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body (Assamese)',
      type: 'blockContent',
    }),
    defineField({
      name: 'englishBody',
      title: 'English Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})