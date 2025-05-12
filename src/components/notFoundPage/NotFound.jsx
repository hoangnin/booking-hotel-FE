import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
// import image from "./image.svg";
import classes from "./NotFound.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={40} cols={1} sm={2}>
        <Image
          src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"
          className={classes.mobileImage}
        />
        <div>
          <Title className={classes.title}>{t("notFound.title")}</Title>
          <Text color="dimmed" size="lg">
            {t("notFound.description")}
          </Text>
          <Button
            component={Link}
            to="/"
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
          >
            {t("notFound.button")}
          </Button>
        </div>
        <Image
          src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"
          className={classes.desktopImage}
        />
      </SimpleGrid>
    </Container>
  );
}

export default NotFoundPage;
