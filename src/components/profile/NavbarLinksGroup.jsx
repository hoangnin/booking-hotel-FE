import { useState } from "react";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import classes from "./NavbarLinksGroup.module.css";

export function LinksGroup({
  icon: Icon,
  label,
  link,
  links = [],
  initiallyOpened,
}) {
  const hasLinks = links.length > 0;
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = links.map((link) => (
    <NavLink className={classes.link} to={link.link} key={link.label}>
      {link.label}
    </NavLink>
  ));

  // Nếu là mục có submenu
  if (hasLinks) {
    return (
      <>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={classes.control}
        >
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          </Group>
        </UnstyledButton>
        <Collapse in={opened}>{items}</Collapse>
      </>
    );
  }

  // Nếu chỉ là 1 link thường
  return (
    <NavLink to={link} className={classes.control}>
      <Group justify="space-between" gap={0}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <ThemeIcon variant="light" size={30}>
            <Icon size={18} />
          </ThemeIcon>
          <Box ml="md">{label}</Box>
        </Box>
      </Group>
    </NavLink>
  );
}

const mockdata = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
}
