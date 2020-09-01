import { stringify } from 'query-string';
import request from '@/utils/request';

export const fetchScopes = () => request({
  url: '/api/o/scope/',
});

export const fetchAuthorizePage = (params) => {
  const search = params instanceof Object ? `?${stringify(params)}` : params;
  return request({
    url: `/api/o/authorize/${search}`,
    // headers: {
    //   'Content-Type': 'text/html',
    // },
  });
};

export const postAuthorize = (data) => request({
  url: `/api/o/authorize/`,
  method: 'POST',
  data,
})
