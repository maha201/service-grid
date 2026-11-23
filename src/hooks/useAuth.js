import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = (email) => {
    dispatch(loginSuccess({ email, name: email.split('@')[0] || 'Admin' }));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { user, isAuthenticated, login, signOut };
};
