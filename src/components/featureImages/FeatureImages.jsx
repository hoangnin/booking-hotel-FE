import {
  Container,
  Image,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import IMAGES from "./images.js";
import classes from "./FeaturesImages.module.css";
import { useTranslation } from "react-i18next";

const data = [
  {
    image: "auditors",
    titleKey: "features.easyBooking.title",
    descriptionKey: "features.easyBooking.description",
  },
  {
    image: "lawyers",
    titleKey: "features.securePayment.title",
    descriptionKey: "features.securePayment.description",
  },
  {
    image: "accountants",
    titleKey: "features.support.title",
    descriptionKey: "features.support.description",
  },
  {
    image: "others",
    titleKey: "features.deals.title",
    descriptionKey: "features.deals.description",
  },
];

export function FeaturesImages() {
  const { t } = useTranslation();

  const items = data.map((item) => (
    <div className={classes.item} key={item.image}>
      <ThemeIcon
        variant="light"
        className={classes.itemIcon}
        size={60}
        radius="md"
      >
        <Image src={IMAGES[item.image]} />
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {t(item.titleKey)}
        </Text>
        <Text c="dimmed">{t(item.descriptionKey)}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>{t("features.supTitle")}</Text>

      <Title className={classes.title} order={2}>
        {t("features.title.first")}{" "}
        <span className={classes.highlight}>
          {t("features.title.highlight")}
        </span>{" "}
        {t("features.title.second")}
      </Title>

      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          {t("features.description")}
        </Text>
      </Container>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
