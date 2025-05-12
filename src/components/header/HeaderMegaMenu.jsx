import React, { forwardRef, useEffect } from "react";
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
import LanguageSwitcher from "../LanguageSwitcher"; // Import LanguageSwitcher
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import i18n from "i18next"; // Import i18n directly

const mockdata = [
  {
    icon: IconCode,
    titleKey: "header.features.openSource.title",
    descriptionKey: "header.features.openSource.description",
  },
  {
    icon: IconCoin,
    titleKey: "header.features.free.title",
    descriptionKey: "header.features.free.description",
  },
  {
    icon: IconBook,
    titleKey: "header.features.documentation.title",
    descriptionKey: "header.features.documentation.description",
  },
  {
    icon: IconFingerprint,
    titleKey: "header.features.security.title",
    descriptionKey: "header.features.security.description",
  },
  {
    icon: IconChartPie3,
    titleKey: "header.features.analytics.title",
    descriptionKey: "header.features.analytics.description",
  },
  {
    icon: IconNotification,
    titleKey: "header.features.notifications.title",
    descriptionKey: "header.features.notifications.description",
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
  const { t } = useTranslation(); // Initialize useTranslation hook

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
    <UnstyledButton className={classes.subLink} key={item.titleKey}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {t(item.titleKey)}
          </Text>
          <Text size="xs" c="dimmed">
            {t(item.descriptionKey)}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  // Force i18n refresh when component renders
  useEffect(() => {
    // Check if there's a session language that hasn't been applied to i18n yet
    const sessionLanguage = sessionStorage.getItem("detectedLanguage");
    const currentLanguage = i18n.language;

    if (sessionLanguage && sessionLanguage !== currentLanguage) {
      console.log(
        `HeaderMegaMenu: Applying session language ${sessionLanguage}`
      );
      i18n.changeLanguage(sessionLanguage);
    }
  }, [i18n]);

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
                {t("common.home")}
              </Link>
              <Link to="/hotels" className={classes.link}>
                {t("common.hotels")}
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
                        {t("header.features.title")}
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>{t("header.features.title")}</Text>
                    <Anchor href="#" fz="xs">
                      {t("header.features.viewAll")}
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
                          {t("header.getStarted.title")}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {t("header.getStarted.description")}
                        </Text>
                      </div>
                      <Button variant="default">
                        {t("header.getStarted.button")}
                      </Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="#" className={classes.link}>
                {t("header.learn")}
              </a>
              <a href="#" className={classes.link}>
                {t("header.academy")}
              </a>
            </Group>
            <Group visibleFrom="sm">
              <LanguageSwitcher />
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
                    <Menu.Label>{t("header.menu.application")}</Menu.Label>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                      <Menu.Item leftSection={<IconUser size={14} />}>
                        {t("common.profile")}
                      </Menu.Item>
                    </Link>
                    <Menu.Item leftSection={<IconSettings size={14} />}>
                      {t("header.menu.settings")}
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>{t("header.menu.dangerZone")}</Menu.Label>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={handleLogout}
                    >
                      {t("common.logout")}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <>
                  <Button
                    variant="default"
                    onClick={() => openAuthModalHandler("login")}
                  >
                    {t("common.login")}
                  </Button>
                  <Button onClick={() => openAuthModalHandler("register")}>
                    {t("common.signup")}
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
          title={t("header.navigation")}
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            <Divider my="sm" />

            <a href="#" className={classes.link}>
              {t("common.home")}
            </a>
            <Link to="/hotels" className={classes.link}>
              {t("common.hotels")}
            </Link>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  {t("header.features.title")}
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              {t("header.learn")}
            </a>
            <a href="#" className={classes.link}>
              {t("header.academy")}
            </a>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button
                variant="default"
                onClick={() => openAuthModalHandler("login")}
              >
                {t("common.login")}
              </Button>
              <Button onClick={() => openAuthModalHandler("register")}>
                {t("common.signup")}
              </Button>
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
