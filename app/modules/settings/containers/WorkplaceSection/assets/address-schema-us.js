export default {
  type: 'object',
  required: ['country_code', 'level_2', 'level_3', 'address'],
  properties: {
    country_code: {
      type: 'string',
      title: 'Country',
    },
    level_2: {
      type: 'string',
      title: 'State',
    },
    level_3: {
      type: 'string',
      title: 'city',
    },
    address: {
      type: 'string',
      title: 'Address',
    },
    name: {
      type: 'string',
      title: 'Name',
    },
  },
  order: ['name', 'address', 'level_3', 'level_2', 'country_code'],
};
