'use client';

import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseMantineProvider theme={theme}>
      <Notifications position="top-right" />
      {children}
    </BaseMantineProvider>
  );
}
