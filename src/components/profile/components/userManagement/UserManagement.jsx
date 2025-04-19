import { useState } from "react";
import { Tabs, Container } from "@mantine/core";
import { UsersRolesTable } from "./UsersRolesTable";

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Container size="xl" py="md">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="hotelOwners">Hotel Owners</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users" pt="md">
          <UsersRolesTable tab="users" />
        </Tabs.Panel>

        <Tabs.Panel value="hotelOwners" pt="md">
          <UsersRolesTable tab="hotelOwners" />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
