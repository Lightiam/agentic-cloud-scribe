
import { api } from './apiConfig';

export const authAPI = {
  register: (data: { email: string; username: string; password: string }) => {
    console.log('Calling register API with data:', { email: data.email, username: data.username });
    return api.post('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    console.log('Calling login API with email:', data.email);
    return api.post('/auth/login', data);
  },
};
