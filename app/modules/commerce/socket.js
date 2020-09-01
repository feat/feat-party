import createSocket from '@/utils/createSocket';

export const transactionSocket = createSocket('/transaction', {
  autoConnect: false,
});

export const serviceSocket = createSocket('/service', {
  autoConnect: false,
});

export const geoSocket = createSocket('/geo', {
  autoConnect: false,
});
