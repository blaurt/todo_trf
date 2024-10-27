'use client';
import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from '../store/auth/user.types';
import { LoginPayload, useLoginMutation } from '../store/auth/AuthSlice';
import { toast } from 'react-toastify';

export type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserType | null) => void;
  login: (params: LoginPayload) => void;
};

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleLogout = async () => {
    if (!user) return;
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const handleLoginResult = async (params: LoginPayload) => {
    try {
      const { email, password } = params;
      const data = {
        email,
        password,
      };

      const loginResponse = await login({ ...data }).unwrap();
      toast.success(`Successfully logged in!`, { autoClose: 700 });

      const { access_token, user } = loginResponse;
      window.localStorage.setItem('userData', JSON.stringify(user));
      window.localStorage.setItem('accessToken', access_token);
      setUser(user);
      const returnUrl = '/';
      router.replace(returnUrl as string);
    } catch (error: any) {
      toast.error('Something went wrong');
      console.error('Signup error:', error);
    }
  };

  useEffect(() => {
    setLoading(true);

    const userData: UserType | null = JSON.parse(localStorage.getItem('userData') ?? 'null');

    if (!user && userData) {
      setUser(userData);
    }

    setLoading(false);
  }, [user]);

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLoginResult,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values as any}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { useAuth, AuthContext, AuthProvider };
