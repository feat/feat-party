export default {
  type: 'object',
  required: ['country_code', 'level_2', 'level_3', 'address'],
  properties: {
    country_code: {
      type: 'string',
      title: '国家',
    },
    level_2: {
      type: 'string',
      title: '省',
      levelItem: true,
    },
    level_3: {
      type: 'string',
      title: '市',
      levelItem: true,
    },
    level_4: {
      type: 'string',
      title: '区',
      levelItem: true,
    },
    address: {
      type: 'string',
      title: '地址',
    },
  },
  order: ['country_code', 'level_2', 'level_3', 'level_4', 'address'],
};
