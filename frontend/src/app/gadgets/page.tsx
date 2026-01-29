'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Group,
  Text,
  Loader,
  Center,
  AppShell,
  Menu,
  Avatar,
  Badge,
} from '@mantine/core';
import { IconPlus, IconLogout, IconUser, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { GadgetTable } from '@/components/GadgetTable';
import { CreateGadgetModal } from '@/components/CreateGadgetModal';
import { GadgetModal } from '@/components/GadgetModal';
import { ApiError, Gadget, User, api } from '@/lib/api';
import { getUser, setUser, clearAuth } from '@/lib/auth';

export default function GadgetsPage() {
  const router = useRouter();
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [gadgetModalMode, setGadgetModalMode] = useState<'view' | 'edit'>('view');
  const [gadgetModalOpen, setGadgetModalOpen] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [user, setCurrentUser] = useState<User | null>(getUser());

  const fetchGadgets = useCallback(async () => {
    try {
      const data = await api.getGadgets();
      setGadgets(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuth();
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Failed to fetch gadgets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/ws/gadgets/`);

    ws.onopen = () => {
      setWsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);

      if (data.action === 'created' && data.gadget) {
        setGadgets((prev) => [data.gadget, ...prev]);
      } else if (data.action === 'updated' && data.gadget) {
        setGadgets((prev) =>
          prev.map((g) => (g.id === data.gadget.id ? data.gadget : g))
        );
      } else if (data.action === 'deleted' && data.gadget_id) {
        setGadgets((prev) => prev.filter((g) => g.id !== data.gadget_id));
      } else if (data.action === 'bulk_deleted' && data.ids) {
        setGadgets((prev) => prev.filter((g) => !data.ids.includes(g.id)));
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await api.getMe();
        setUser(me);
        setCurrentUser(me);
      } catch {
        clearAuth();
        router.push('/');
        return;
      }

      fetchGadgets();
      connectWebSocket();
    };

    init();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [router, fetchGadgets, connectWebSocket]);

  const handleLogout = () => {
    clearAuth();
    if (wsRef.current) {
      wsRef.current.close();
    }
    router.push('/');
  };

  const handleViewGadget = (gadget: Gadget) => {
    setSelectedGadget(gadget);
    setGadgetModalMode('view');
    setGadgetModalOpen(true);
  };

  const handleEditGadget = (gadget: Gadget) => {
    setSelectedGadget(gadget);
    setGadgetModalMode('edit');
    setGadgetModalOpen(true);
  };

  const handleCloseGadgetModal = () => {
    setGadgetModalOpen(false);
    setSelectedGadget(null);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Gadget Management</Title>
          <Group>
            <Badge
              leftSection={wsConnected ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
              color={wsConnected ? 'green' : 'red'}
              variant="light"
            >
              {wsConnected ? 'Live' : 'Offline'}
            </Badge>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" leftSection={<Avatar size="sm" radius="xl" />}>
                  {user?.first_name || user?.username}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />} disabled>
                  {user?.email}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={2}>My Gadgets</Title>
              <Text c="dimmed" size="sm">
                {gadgets.length} gadget{gadgets.length !== 1 ? 's' : ''} total
              </Text>
            </div>
            <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
              Create Gadget
            </Button>
          </Group>

          <GadgetTable
            gadgets={gadgets}
            onRefresh={fetchGadgets}
            onView={handleViewGadget}
            onEdit={handleEditGadget}
          />
        </Container>
      </AppShell.Main>

      <CreateGadgetModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchGadgets}
      />

      <GadgetModal
        gadget={selectedGadget}
        mode={gadgetModalMode}
        opened={gadgetModalOpen}
        onClose={handleCloseGadgetModal}
        onSuccess={fetchGadgets}
        onModeChange={setGadgetModalMode}
      />
    </AppShell>
  );
}
