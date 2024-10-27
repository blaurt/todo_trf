import { ReactNode, ReactElement, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { Preloader } from '../../app/_components/Preloader';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const authRoutes = ['/auth/login', '/auth/signup'];
const notProtectedRoutes = ['/', ...authRoutes];

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const isPublicRoute = notProtectedRoutes.includes(path);

  useEffect(() => {
    if (user && authRoutes.includes(path)) {
      router.replace('/');
    }

    if (user === null && !window.localStorage.getItem('userData')) {
      if (!isPublicRoute) {
        router.replace(`/auth/login?returnUrl=${path}`);
      }
    }
  }, [router, path, user]);

  return <>{children}</>;
};

export default AuthGuard;
