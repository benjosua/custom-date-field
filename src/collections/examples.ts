import { CollectionConfig } from 'payload/types';
import { CustomDateField } from '../fields/customDateField/field';

const Examples: CollectionConfig = {
  slug: 'examples',
  fields: [
    {
        type: 'text',
        name: 'title',
        label: 'Title',
        required: true,
    },
    CustomDateField,
  ],
}

export default Examples;