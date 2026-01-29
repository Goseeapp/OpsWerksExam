'use client';

import { useState } from 'react';
import {
  Table,
  Checkbox,
  Button,
  Group,
  Text,
  ActionIcon,
  Paper,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconEye, IconEdit } from '@tabler/icons-react';
import { Gadget, api } from '@/lib/api';

interface GadgetTableProps {
  gadgets: Gadget[];
  onRefresh: () => void;
  onView: (gadget: Gadget) => void;
  onEdit: (gadget: Gadget) => void;
}

export function GadgetTable({ gadgets, onRefresh, onView, onEdit }: GadgetTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);

  const allSelected = gadgets.length > 0 && selectedIds.length === gadgets.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < gadgets.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gadgets.map((g) => g.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setDeleting(true);
    try {
      await api.bulkDeleteGadgets(selectedIds);
      notifications.show({
        title: 'Success',
        message: `Deleted ${selectedIds.length} gadget(s)`,
        color: 'green',
      });
      setSelectedIds([]);
      onRefresh();
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete gadgets',
        color: 'red',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteGadget(id);
      notifications.show({
        title: 'Success',
        message: 'Gadget deleted',
        color: 'green',
      });
      setSelectedIds(selectedIds.filter((i) => i !== id));
      onRefresh();
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete gadget',
        color: 'red',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      {selectedIds.length > 0 && (
        <Group mb="md">
          <Text size="sm" c="dimmed">
            {selectedIds.length} selected
          </Text>
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<IconTrash size={14} />}
            onClick={handleBulkDelete}
            loading={deleting}
          >
            Delete Selected
          </Button>
        </Group>
      )}

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Last Modified</Table.Th>
            <Table.Th style={{ width: 120 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {gadgets.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed" py="xl">
                  No gadgets found. Create your first gadget!
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            gadgets.map((gadget) => (
              <Table.Tr
                key={gadget.id}
                bg={selectedIds.includes(gadget.id) ? 'var(--mantine-color-blue-light)' : undefined}
              >
                <Table.Td>
                  <Checkbox
                    checked={selectedIds.includes(gadget.id)}
                    onChange={() => toggleRow(gadget.id)}
                    aria-label={`Select ${gadget.name}`}
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{gadget.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {gadget.description || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(gadget.created)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(gadget.last_modified)}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="View">
                      <ActionIcon variant="light" onClick={() => onView(gadget)}>
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit">
                      <ActionIcon variant="light" color="blue" onClick={() => onEdit(gadget)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(gadget.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
