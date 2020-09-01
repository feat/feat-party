import request from '@/utils/request';

export const getEvent = ({ eventId }) =>
  request({
    url: `/api/xfile/event/${eventId}/`,
  });

export const getEvents = (params) =>
  request({
    url: '/api/xfile/event/',
    params,
  });

export const getUserEvents = (userId, params = {}) =>
  request({
    url: `/api/xfile/event/${userId}/view-list/`,
    params,
  });

export const createEvent = (data) =>
  request({
    url: '/api/xfile/event/',
    method: 'POST',
    data,
  });

export const updateEvent = ({ eventId, data }) =>
  request({
    url: `/api/xfile/event/${eventId}/`,
    method: 'PATCH',
    data,
  });

export const deleteEvent = ({ eventId }) =>
  request({
    url: `/api/xfile/event/${eventId}/`,
    method: 'DELETE',
  });

export const addPlate = ({ eventId, type, photo }) => {
  const formData = new FormData();
  formData.append('event', eventId);
  formData.append('type', type);
  formData.append('photo', photo);
  return request({
    url: '/api/xfile/plate/',
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};
export const deletePlate = ({ plateId }) =>
  request({
    url: `/api/xfile/plate/${plateId}/`,
    method: 'DELETE',
  });

export const fetchCommentedEvent = () =>
  request({
    url: '/api/xfile/event/new-comment-event/',
    method: 'GET',
  });

export const fetchActivities = (params) => 
  request({
    url: '/api/xfile/event/activity-list/',
    params,
  })