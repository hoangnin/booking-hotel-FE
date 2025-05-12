import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { ActionIcon, Container, Group, Text } from "@mantine/core";
import logo from "../../assets/images/logo.svg.png";
import classes from "./FooterLinks.module.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const data = [
  {
    titleKey: "footer.sections.about.title",
    links: [
      { labelKey: "footer.sections.about.features", link: "#" },
      { labelKey: "footer.sections.about.pricing", link: "#" },
      { labelKey: "footer.sections.about.support", link: "#" },
      { labelKey: "footer.sections.about.forums", link: "#" },
    ],
  },
  {
    titleKey: "footer.sections.project.title",
    links: [
      { labelKey: "footer.sections.project.contribute", link: "#" },
      { labelKey: "footer.sections.project.mediaAssets", link: "#" },
      { labelKey: "footer.sections.project.changelog", link: "#" },
      { labelKey: "footer.sections.project.releases", link: "#" },
    ],
  },
  {
    titleKey: "footer.sections.community.title",
    links: [
      { labelKey: "footer.sections.community.discord", link: "#" },
      { labelKey: "footer.sections.community.twitter", link: "#" },
      { labelKey: "footer.sections.community.newsletter", link: "#" },
      { labelKey: "footer.sections.community.github", link: "#" },
    ],
  },
];

export function FooterLinks() {
  const { t } = useTranslation();

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {t(link.labelKey)}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.titleKey}>
        <Text className={classes.title}>{t(group.titleKey)}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: 30 }} />
          </Link>
          <Text size="xs" c="dimmed" className={classes.description}>
            {t("footer.description")}
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          {t("footer.copyright")}
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
