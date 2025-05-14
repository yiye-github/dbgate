import getElectron from './getElectron';

let apiUrl = null;
try {
  apiUrl = process.env.API_URL;
} catch {}

export default function resolveApi() {
  if (apiUrl) {
    return apiUrl;
  }
  return (window.location.origin + window.location.pathname).replace(/\/*$/, '');
}

export function resolveApiHeaders() {
  const electron = getElectron();

  const res = {};
  const accessToken = localStorage.getItem('accessToken');
  const accessToken_idp = localStorage.getItem('access_token');
  const resourceId = localStorage.getItem('resource_id');
  if (accessToken) {
    res['Authorization'] = `Bearer ${accessToken}`;
  }
  if (accessToken_idp) {
    res['X-Access-Token'] = accessToken_idp;
  }
  if (resourceId) {
    res['X-Resource-Id'] = resourceId;
  }
  return res;
}
