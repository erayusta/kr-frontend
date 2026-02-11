import axios from 'axios';
import { getServerApiUrl } from './config';

const MAX_RETRIES = 2;
const RETRY_DELAY = 500; // ms

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Server-side API request helper (for getServerSideProps)
const serverApiRequest = async (url, method = 'get', data = {}, headers = {}) => {
  const apiUrl = getServerApiUrl();
  const fullUrl = `${apiUrl}${url}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Server API Retry] Attempt ${attempt + 1}/${MAX_RETRIES + 1} ${method.toUpperCase()} ${fullUrl}`);
        await sleep(RETRY_DELAY * attempt);
      } else {
        console.log(`[Server API Request] ${method.toUpperCase()} ${fullUrl}`);
      }

      const response = await axios({
        method,
        url: fullUrl,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: 10000,
      });

      console.log(`[Server API Success] ${method.toUpperCase()} ${fullUrl}`);
      return response.data;
    } catch (error) {
      const isRetryable = error.code === 'EPROTO' || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED';

      if (isRetryable && attempt < MAX_RETRIES) {
        console.warn(`[Server API Retry] ${error.code} for ${fullUrl}, retrying...`);
        continue;
      }

      console.error(`[Server API Error] ${method.toUpperCase()} ${fullUrl}`, error.message);
      if (error.response) {
        console.error('[Server API Error Response]', error.response.status);
      }
      if (error.code) {
        console.error('[Server API Error Code]', error.code);
      }
      throw error;
    }
  }
};

export default serverApiRequest;
