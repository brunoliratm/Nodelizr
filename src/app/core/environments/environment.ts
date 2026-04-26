const remoteApiUrl = 'https://nodelizr-api.vercel.app/api';
const localApiUrl = 'http://localhost:3000/api';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

export const environment = {
  apiUrl: isLocalhost ? localApiUrl : remoteApiUrl,
  remoteApiUrl,
  localApiUrl,
  isLocalhost,
};
