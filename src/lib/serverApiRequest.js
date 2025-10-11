import axios from 'axios';
import { getServerApiUrl } from './config';

// Server-side API request helper (for getServerSideProps)
const serverApiRequest = async (url, method = 'get', data = {}, headers = {}) => {
  const apiUrl = getServerApiUrl();
  
  try {
    const fullUrl = `${apiUrl}${url}`;
    console.log(`[Server API Request] ${method.toUpperCase()} ${fullUrl}`);
    
    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    });
    
    console.log(`[Server API Success] ${method.toUpperCase()} ${fullUrl}`);
    return response.data;
  } catch (error) {
    console.error(`[Server API Error] ${method.toUpperCase()} ${apiUrl}${url}`, error.message);
    if (error.response) {
      console.error('[Server API Error Response]', error.response.status);
      console.error('[Server API Error Data]', error.response.data);
    }
    throw error;
  }
};

export default serverApiRequest;