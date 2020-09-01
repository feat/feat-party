import request from '@/utils/request';

export const search = ({ keyword, types, page_size, page, second }) => {
  const type = types && types.length ? types.join(',') : undefined;
  return request({
    url: '/api/search2/search/',
    method: 'GET',
    params: {
      keyword,
      type,
      page_size,
      page,
      second,
    },
  });
};
