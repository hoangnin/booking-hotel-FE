import { Button, Image, Text, TextInput, Title } from "@mantine/core";
import image from "../emailBaner/image.svg";
import classes from "./EmailBanner.module.css";
import { useTranslation } from "react-i18next";

export function EmailBanner() {
  const { t } = useTranslation();

  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>{t("emailBanner.title")}</Title>
        <Text fw={500} fz="lg" mb={5}>
          {t("emailBanner.subtitle")}
        </Text>
        <Text fz="sm" c="dimmed">
          {t("emailBanner.description")}
        </Text>

        <div className={classes.controls}>
          <TextInput
            placeholder={t("emailBanner.emailPlaceholder")}
            classNames={{ input: classes.input, root: classes.inputWrapper }}
          />
          <Button className={classes.control}>
            {t("emailBanner.subscribeButton")}
          </Button>
        </div>
      </div>
      <Image src={image} className={classes.image} />
    </div>
  );
}
