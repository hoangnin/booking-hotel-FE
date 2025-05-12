import { IconCheck } from "@tabler/icons-react";
import {
  Button,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
// import image from "./image.svg";
import classes from "./HeroBullets.module.css";
import { useTranslation } from "react-i18next";

export function HeroBullets() {
  const { t } = useTranslation();

  return (
    <Container size="lg" style={{ maxWidth: "1200px" }}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            {t("home.heroTitle.first")}{" "}
            <span className={classes.highlight}>
              {t("home.heroTitle.highlight")}
            </span>{" "}
            {t("home.heroTitle.second")} <br /> {t("home.heroTitle.third")}
          </Title>
          <Text c="dimmed" mt="md">
            {t("home.heroDescription")}
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>{t("home.features.quickBooking.title")}</b> –{" "}
              {t("home.features.quickBooking.description")}
            </List.Item>
            <List.Item>
              <b>{t("home.features.bestPrice.title")}</b> –{" "}
              {t("home.features.bestPrice.description")}
            </List.Item>
            <List.Item>
              <b>{t("home.features.realReviews.title")}</b> –{" "}
              {t("home.features.realReviews.description")}
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              component={Link}
              to="/hotels"
              radius="xl"
              size="md"
              className={classes.control}
            >
              {t("home.buttons.searchNow")}
            </Button>
            <Button
              component={Link}
              to="/hotels"
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              {t("home.buttons.viewDeals")}
            </Button>
          </Group>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          className={classes.image}
        />
      </div>
    </Container>
  );
}
