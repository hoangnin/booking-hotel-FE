import { Container, Title, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export function OAuthFailed() {
  const { t } = useTranslation();

  return (
    <Container size="md" py="xl">
      <div style={{ textAlign: "center" }}>
        <Title order={2} mb="md">
          {t("auth.accountBanned")}
        </Title>
        <Text size="lg" mb="xl" c="dimmed">
          {t("auth.accountBannedMessage")}
        </Text>
        <Group justify="center">
          <Button
            component={Link}
            to="/"
            leftSection={<IconArrowLeft size={14} />}
            variant="default"
          >
            {t("common.backToHome")}
          </Button>
          <Button component="a" href="mailto:support@hotel.com" variant="light">
            {t("common.contactSupport")}
          </Button>
        </Group>
      </div>
    </Container>
  );
}
