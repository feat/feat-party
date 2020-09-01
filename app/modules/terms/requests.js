import request from '@/utils/request';

// TODO: pass locale param 
export const fetchTerm = (slug) =>
  request({
    url: `/api/ui-translation/terms/${slug}/?language_locale=en`,
    method: 'GET',
  });
