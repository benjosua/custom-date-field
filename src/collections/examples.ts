import { CollectionConfig } from 'payload/types';
import { CustomDateField } from '../fields/customDateField/field';

const Examples: CollectionConfig = {
  slug: 'examples',
  fields: [
    CustomDateField,
  ],
}

export default Examples;