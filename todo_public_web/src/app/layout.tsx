'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { Navigation } from './_components/Nav';

import './styles/globals.css';
import styles from './styles/layout.module.css';
import { AuthProvider } from '../lib/utils/AuthContext';
import AuthGuard from '../lib/utils/AuthGuard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <React.StrictMode>
          <StoreProvider>
            <AuthProvider>
              <Navigation />

              <AuthGuard fallback={null}>
                <ToastContainer />
                <main className={styles.main}>{children}</main>
              </AuthGuard>
            </AuthProvider>
          </StoreProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
