'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { api, ApiError } from '@/lib/api';
import { setUser } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 1 ? 'Username is required' : null),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.login(values.username, values.password);
      setUser(response.user);
      router.push('/gadgets');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Gadget Management System
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Sign in to manage your gadgets
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
                {error}
              </Alert>
            )}

            <TextInput
              label="Username"
              placeholder="Enter your username"
              required
              {...form.getInputProps('username')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              {...form.getInputProps('password')}
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
