import { Container, Title, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

export function OAuthFailed() {
  return (
    <Container size="md" py="xl">
      <div style={{ textAlign: "center" }}>
        <Title order={2} mb="md">
          Account Banned
        </Title>
        <Text size="lg" mb="xl" c="dimmed">
          Your account has been banned. Please contact our support team for more
          information.
        </Text>
        <Group justify="center">
          <Button
            component={Link}
            to="/"
            leftSection={<IconArrowLeft size={14} />}
            variant="default"
          >
            Back to Home
          </Button>
          <Button component="a" href="mailto:support@hotel.com" variant="light">
            Contact Support
          </Button>
        </Group>
      </div>
    </Container>
  );
}
