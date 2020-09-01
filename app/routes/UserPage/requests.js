import request from '@/utils/request';

export const fetchUserList = () =>
  request({
    url: '/api/user/users/',
    method: 'GET',
  });
