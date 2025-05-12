import { Accordion, Container, Grid, Image, Title } from "@mantine/core";
// import image from "./image.svg";
import classes from "./Faq.module.css";
import { useTranslation } from "react-i18next";

export function Faq() {
  const { t } = useTranslation();

  return (
    <div className={classes.wrapper}>
      <Container size="lg">
        <Grid id="faq-grid" gutter={50}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image
              src="https://ui.mantine.dev/_next/static/media/image.b0c2306b.svg"
              alt={t("faq.imageAlt")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={2} ta="left" className={classes.title}>
              {t("faq.title")}
            </Title>

            <Accordion
              chevronPosition="right"
              defaultValue="reset-password"
              variant="separated"
            >
              <Accordion.Item className={classes.item} value="reset-password">
                <Accordion.Control>
                  {t("faq.resetPassword.question")}
                </Accordion.Control>
                <Accordion.Panel>
                  {t("faq.resetPassword.answer")}
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="another-account">
                <Accordion.Control>
                  {t("faq.multipleAccounts.question")}
                </Accordion.Control>
                <Accordion.Panel>
                  {t("faq.multipleAccounts.answer")}
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="newsletter">
                <Accordion.Control>
                  {t("faq.newsletter.question")}
                </Accordion.Control>
                <Accordion.Panel>{t("faq.newsletter.answer")}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="credit-card">
                <Accordion.Control>
                  {t("faq.creditCard.question")}
                </Accordion.Control>
                <Accordion.Panel>{t("faq.creditCard.answer")}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
