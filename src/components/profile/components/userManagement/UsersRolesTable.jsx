import {
  Avatar,
  Badge,
  Group,
  Select,
  Table,
  Text,
  LoadingOverlay,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Button,
  Tooltip,
  Pagination,
  Center,
  Paper,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  unblockUser,
  activateHotelOwner,
  blockUser,
  searchUser,
} from "../../../../util/http";
import {
  IconDots,
  IconUserCheck,
  IconUserX,
  IconUserPlus,
  IconPencil,
  IconMapPin,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { notifications } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";

function InputWithButton(props) {
  const theme = useMantineTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <TextInput
      ref={inputRef}
      radius="xl"
      size="sm"
      placeholder="Search users by name, email, or phone..."
      rightSectionWidth={42}
      leftSection={<IconSearch size={16} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={28}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          <IconArrowRight size={16} stroke={1.5} />
        </ActionIcon>
      }
      styles={{
        input: {
          width: "400px",
        },
      }}
      {...props}
    />
  );
}

export function UsersRolesTable({ tab }) {
  const [banModalOpened, setBanModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, debouncedSearch, tab],
    queryFn: async () => {
      if (debouncedSearch) {
        const searchData = await searchUser(debouncedSearch);
        // Convert array to pagination format
        return {
          content: searchData,
          totalElements: searchData.length,
          totalPages: 1,
          size: searchData.length,
          number: 0,
        };
      }
      return getAllUsers(page - 1);
    },
  });

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const unblockMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show({
        title: "Success",
        message: "User has been unblocked",
        color: "green",
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateHotelOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show({
        title: "Success",
        message: "User has been activated as hotel owner",
        color: "green",
      });
    },
  });

  const blockMutation = useMutation({
    mutationFn: ({ userId, banReason }) => blockUser(userId, banReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show({
        title: "Success",
        message: "User has been blocked",
        color: "green",
      });
      setBanModalOpened(false);
      setBanReason("");
    },
  });

  if (isError) {
    return (
      <Text color="red">Failed to load users. Please try again later.</Text>
    );
  }

  if (!data || !data.content || data.content.length === 0) {
    return (
      <>
        <Center mb="xl">
          <InputWithButton
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Center>
        <Text color="dimmed">No users found.</Text>
      </>
    );
  }

  // Filter users based on tab after getting data
  const filteredUsers = data.content.filter((user) => {
    if (tab === "users") {
      return (
        user.roles.some((role) => role.name === "ROLE_USER") &&
        !user.roles.some((role) => role.name === "ROLE_HOTEL")
      );
    } else if (tab === "hotelOwners") {
      return user.roles.some((role) => role.name === "ROLE_HOTEL");
    }
    return false;
  });

  const rows = filteredUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={user.avatarUrl} radius={40}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {user.username}
            </Text>
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <IconMapPin size={16} color="gray" />
          <Text size="sm" c={user.address ? "dark" : "dimmed"}>
            {user.address || "No address provided"}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{user.phone || "N/A"}</Text>
      </Table.Td>

      <Table.Td>
        <Badge
          color={user.active ? "green" : "red"}
          variant="light"
          size="lg"
          radius="sm"
          style={{ width: "100px" }}
        >
          {user.active ? "Active" : "Banned"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group justify="flex-end">
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconPencil size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {tab === "users" && (
                <Menu.Item
                  leftSection={<IconUserPlus size={14} />}
                  onClick={() => activateMutation.mutate(user.id)}
                >
                  Activate as Hotel Owner
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<IconUserX size={14} />}
                onClick={() => handleBlockUser(user)}
              >
                Block User
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUserCheck size={14} />}
                onClick={() => unblockMutation.mutate(user.id)}
              >
                Unblock User
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setBanModalOpened(true);
  };

  const handleConfirmBlock = () => {
    if (selectedUser && banReason) {
      blockMutation.mutate({ userId: selectedUser.id, banReason });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Center mb="xl">
        <InputWithButton
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Center>

      {filteredUsers.length === 0 ? (
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            background: "linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)",
          }}
        >
          <IconSearch
            style={{
              width: rem(40),
              height: rem(40),
              color: "#adb5bd",
              marginBottom: "1rem",
            }}
          />
          <Text size="lg" c="dimmed" ta="center">
            {searchQuery
              ? "No users found matching your search criteria"
              : "No users found in this category"}
          </Text>
        </Paper>
      ) : (
        <>
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Address</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {!debouncedSearch && (
            <Center mt="xl">
              <Pagination
                value={page}
                onChange={setPage}
                total={data.totalPages}
                siblings={1}
                boundaries={1}
                color="blue"
                radius="md"
              />
            </Center>
          )}
        </>
      )}

      <Modal
        opened={banModalOpened}
        onClose={() => setBanModalOpened(false)}
        title="Block User"
        radius="md"
      >
        <TextInput
          label="Ban Reason"
          placeholder="Enter reason for blocking user"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          required
          radius="md"
        />
        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setBanModalOpened(false)}
            radius="md"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirmBlock}
            loading={blockMutation.isPending}
            radius="md"
          >
            Block User
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
