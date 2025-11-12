const TOKEN_KEY = 'forum_token';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const loadToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
