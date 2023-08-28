import axios from '@/utils/axios';
// import { AxiosResponse } from 'axios';

// interface PageInterface {
//   page: number;
//   per_page: number;
//   total: number;
//   total_pages: number;
// }

export const getRoles = (params?: any) => axios.get('/roles', params);
