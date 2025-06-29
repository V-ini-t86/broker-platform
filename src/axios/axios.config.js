import axios from 'axios';
import config from '../config';

export const portfolioInstance = axios.create({
  baseURL: config.DUMMY_URL,
});

export const authInstance = axios.create({
  baseURL: config.AUTH_URL,
});


