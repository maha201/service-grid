import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('sg_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: Boolean(savedUser),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('sg_user', JSON.stringify(action.payload));
      localStorage.setItem('sg_token', 'mock-jwt-token');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('sg_user');
      localStorage.removeItem('sg_token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
