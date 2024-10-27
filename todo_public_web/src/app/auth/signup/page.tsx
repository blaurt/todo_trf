'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useSignupMutation } from '../../../lib/store/auth/AuthSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignupFormData = z.infer<typeof signupSchema>;

const DEFAULT_VALUES: SignupFormData = {
  firstName: 'asdf',
  lastName: 'asdf',
  email: 'asdf@asdf.com',
  password: 'asdfasdf',
  confirmPassword: 'asdfasdf',
};

const preFillForm = false;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: preFillForm
      ? DEFAULT_VALUES
      : {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
  });
  const router = useRouter();
  const [signup, { isLoading: isSigningUp, error: signupError }] = useSignupMutation();

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const newUser = await signup({ ...data }).unwrap();
      toast.success(`Successfully registered!`, { autoClose: 700 });
      router.push('/auth/login');
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Signup error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h4"
          align="center"
        >
          Sign Up
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              label="First Name"
              fullWidth
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              label="Last Name"
              fullWidth
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              label="Email"
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            disabled={isSigningUp}
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Up
          </Button>
        </Box>
      </form>
    </Container>
  );
}
