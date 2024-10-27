'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '../styles/layout.module.css';
import { useAuth } from '../../lib/utils/AuthContext';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

export const Navigation = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ mb: 2 }}
      >
        <Toolbar>
          <Button
            color="inherit"
            variant={pathname === '/' ? 'outlined' : 'text'}
          >
            <Link
              className={` ${pathname === '/' ? styles.active : ''}`}
              href="/"
            >
              Home
            </Link>
          </Button>
          <Button
            color="inherit"
            variant={pathname === '/todo-lists' ? 'outlined' : 'text'}
          >
            <Link
              className={` ${pathname === '/todo-lists' ? styles.active : ''}`}
              href="/todo-lists"
            >
              My lists
            </Link>
          </Button>
          {!user ? (
            <>
              <Button
                color="inherit"
                variant={pathname === '/auth/login' ? 'outlined' : 'text'}
              >
                <Link
                  className={` ${pathname === '/auth/login' ? styles.active : ''}`}
                  href="/auth/login"
                >
                  Login
                </Link>
              </Button>
              <Button
                color="inherit"
                variant={pathname === '/auth/signup' ? 'outlined' : 'text'}
              >
                <Link
                  className={` ${pathname === '/auth/signup' ? styles.active : ''}`}
                  href="/auth/signup"
                >
                  Sign-up
                </Link>
              </Button>
            </>
          ) : (
            <span
              className={` ${pathname === '/auth/login' ? styles.active : ''}`}
              onClick={logout}
            >
              <Button color="inherit">Logout</Button>
            </span>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
