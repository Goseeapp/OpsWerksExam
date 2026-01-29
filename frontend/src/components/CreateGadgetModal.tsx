'use client';

import { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

interface CreateGadgetModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateGadgetModal({ opened, onClose, onSuccess }: CreateGadgetModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
    },
  });

  const handleSubmit = async (values: { name: string; description: string }) => {
    setLoading(true);
    try {
      await api.createGadget(values);
      notifications.show({
        title: 'Success',
        message: 'Gadget created successfully',
        color: 'green',
      });
      form.reset();
      onSuccess();
      onClose();
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create gadget',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Create New Gadget" centered>
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
          <Button type="submit" loading={loading}>
            Create Gadget
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
