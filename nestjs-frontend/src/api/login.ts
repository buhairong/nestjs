import axios from '@/utils/axios';
import { AxiosResponse } from 'axios';

export const signin = (username: string, password: string, ...rest: any) =>
  axios.post<any, AxiosResponse<{ access_token: string }, any>>(
    '/auth/signin',
    {
      username,
      password,
      ...rest,
    }
  );

export const signup = (username: string, password: string) =>
  axios.post('/auth/signup', { username, password });
