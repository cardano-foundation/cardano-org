import axios from 'axios';

export const API_TIMEOUT_MS = 10000;

export function makeApiClient(API_URL) {
  return axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT_MS,
    // No Authorization header (public)
    validateStatus: (s) => s >= 200 && s < 300,
  });
}
