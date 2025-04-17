import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
  IconChevronRight,
  IconUser,
  IconSettings,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  Menu,
  Modal,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../../assets/images/logo.svg.png";
import classes from "./HeaderMegaMenu.module.css";
import DarkLight from "../theme/DarkLight";
import { AuthenticationForm } from "../authenticationForm/AuthenticationForm";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  logout,
  closeAuthModal,
  openAuthModal,
} from "../../store/slices/authSlice"; // Import logout action

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon's cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle's tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell's rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

const UserButton = forwardRef(
  ({ image, name, email, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: "var(--mantine-spacing-md)",
        color: "var(--mantine-color-text)",
        borderRadius: "var(--mantine-radius-sm)",
      }}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
);

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Lấy trạng thái đăng nhập từ Redux
  const userInfo = useSelector((state) => state.auth.userInfo); // Lấy thông tin người dùng từ Redux
  const theme = useMantineTheme();
  const authModalOpen = useSelector((state) => state.auth.authModalOpen); // Lấy trạng thái mở modal
  const authModalType = useSelector((state) => state.auth.authModalType); // Lấy loại form (login/register)

  const closeAuthModalHandler = () => {
    dispatch(closeAuthModal());
  };
  const openAuthModalHandler = (type) => {
    dispatch(openAuthModal(type));
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch action logout
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <Box pb={60} pt={60}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link to="/">
              <img src={logo} alt="Logo" style={{ height: 30 }} />
            </Link>
            <Group h="100%" gap={0} visibleFrom="sm">
              <Link to="/" className={classes.link}>
                Home
              </Link>
              <Link to="/hotels" className={classes.link}>
                Hotels
              </Link>
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Features
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Features</Text>
                    <Anchor href="#" fz="xs">
                      View all
                    </Anchor>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>

                  <div className={classes.dropdownFooter}>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500} fz="sm">
                          Get started
                        </Text>
                        <Text size="xs" c="dimmed">
                          Their food sources have decreased, and their numbers
                        </Text>
                      </div>
                      <Button variant="default">Get started</Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="#" className={classes.link}>
                Learn
              </a>
              <a href="#" className={classes.link}>
                Academy
              </a>
            </Group>
            <Group visibleFrom="sm">
              {isLoggedIn && userInfo ? (
                <Menu withArrow>
                  <Menu.Target>
                    <UserButton
                      image={userInfo.avatarUrl}
                      name={userInfo.username}
                      email={userInfo.email}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                      <Menu.Item leftSection={<IconUser size={14} />}>
                        Profile
                      </Menu.Item>
                    </Link>
                    <Menu.Item leftSection={<IconSettings size={14} />}>
                      Settings
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <>
                  <Button
                    variant="default"
                    onClick={() => openAuthModalHandler("login")}
                  >
                    Log in
                  </Button>
                  <Button onClick={() => openAuthModalHandler("register")}>
                    Sign up
                  </Button>
                </>
              )}
            </Group>
            <DarkLight />
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            <Divider my="sm" />

            <a href="#" className={classes.link}>
              Home
            </a>
            <Link to="/hotels" className={classes.link}>
              Hotels
            </Link>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  Features
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default" onClick={() => openAuthModal("login")}>
                Log in
              </Button>
              <Button onClick={() => openAuthModal("register")}>Sign up</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>

      <Modal
        opened={authModalOpen}
        onClose={closeAuthModalHandler}
        withCloseButton={false}
        centered
      >
        <AuthenticationForm
          type={authModalType}
          onLoginSuccess={closeAuthModalHandler}
        />
      </Modal>
    </>
  );
}
