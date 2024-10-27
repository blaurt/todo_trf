'use client';
import { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../../lib/utils/AuthContext';
import { z } from 'zod';

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const preFillForm = false;
const emailDefaultValue = preFillForm ? 'email@example.com' : '';
const passwordDefaultValue = preFillForm ? 'mypassword123' : '';

export default function LoginPage() {
  const [email, setEmail] = useState(emailDefaultValue);
  const [password, setPassword] = useState(passwordDefaultValue);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = () => {
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError('');
    login({ email, password });
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 8 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
        >
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
