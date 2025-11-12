import api from '../../api/dicodingForumApi';

// Register user
export const registerRequest = (payload) => api.post('/register', payload);

// Login (create authentication)
export const loginRequest = (payload) => api.post('/login', payload);

// get own profile
export const getOwnProfile = () => api.get('/users/me');
