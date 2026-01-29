'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Text,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Gadget, api } from '@/lib/api';

interface GadgetModalProps {
  gadget: Gadget | null;
  mode: 'view' | 'edit';
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onModeChange: (mode: 'view' | 'edit') => void;
}

export function GadgetModal({
  gadget,
  mode,
  opened,
  onClose,
  onSuccess,
  onModeChange,
}: GadgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
    },
  });

  useEffect(() => {
    if (gadget) {
      form.setValues({
        name: gadget.name,
        description: gadget.description,
      });
    }
  }, [gadget]);

  const handleSubmit = async (values: { name: string; description: string }) => {
    if (!gadget) return;

    setLoading(true);
    try {
      await api.updateGadget(gadget.id, values);
      notifications.show({
        title: 'Success',
        message: 'Gadget updated successfully',
        color: 'green',
      });
      onSuccess();
      onClose();
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update gadget',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!gadget) return;

    setDeleting(true);
    try {
      await api.deleteGadget(gadget.id);
      notifications.show({
        title: 'Success',
        message: 'Gadget deleted successfully',
        color: 'green',
      });
      onSuccess();
      onClose();
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete gadget',
        color: 'red',
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!gadget) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'view' ? 'Gadget Details' : 'Edit Gadget'}
      centered
      size="md"
    >
      {mode === 'view' ? (
        <Stack>
          <div>
            <Text size="sm" c="dimmed">
              Name
            </Text>
            <Text fw={500}>{gadget.name}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Description
            </Text>
            <Text>{gadget.description || 'No description'}</Text>
          </div>
          <Divider />
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">
                Created
              </Text>
              <Text size="sm">{formatDate(gadget.created)}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Last Modified
              </Text>
              <Text size="sm">{formatDate(gadget.last_modified)}</Text>
            </div>
          </Group>
          <Divider />
          <Group justify="space-between">
            <Button variant="light" color="red" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
            <Button onClick={() => onModeChange('edit')}>Edit</Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Enter gadget name"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Description"
              placeholder="Enter gadget description"
              minRows={3}
              {...form.getInputProps('description')}
            />
            <Group justify="space-between">
              <Button variant="light" onClick={() => onModeChange('view')}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
