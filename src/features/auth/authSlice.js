import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerRequest, loginRequest, getOwnProfile } from './authApi';
import { saveToken, loadToken, clearToken } from '../../utils/authStorage';
import api from '../../api/dicodingForumApi';

const initialToken = loadToken();

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const resp = await registerRequest({ name, email, password });
      return resp.data?.data || resp.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const resp = await loginRequest({ email, password });
      const data = resp.data?.data || resp.data;

      // ambil hanya accessToken
      const { token } = data;

      // simpan ke localStorage
      saveToken(token);

      // set header
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // ambil profil user
      const meResp = await getOwnProfile();
      const me = meResp.data?.data?.user || meResp.data?.data || meResp.data;

      return { token, user: me };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  clearToken();
  delete api.defaults.headers.common.Authorization;
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: initialToken,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(register.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    })
      .addCase(register.fulfilled, (s) => {
        s.status = 'succeeded';
      })
      .addCase(register.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })

      .addCase(login.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })

      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.status = 'idle';
      });
  },
});

export default authSlice.reducer;
