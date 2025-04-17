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

export function HeroBullets() {
  return (
    <Container size="lg" style={{ maxWidth: "1200px" }}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Find Your <span className={classes.highlight}>Perfect</span> Hotel{" "}
            <br /> for Your Journey
          </Title>
          <Text c="dimmed" mt="md">
            Discover thousands of hotels, resorts, and homestays at the best
            prices. Easy booking, secure payment, and exclusive deals await you
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
              <b>Quick Booking</b> – Find and book your room in just minutes
            </List.Item>
            <List.Item>
              <b>Best Price Guarantee</b> – Compare prices from multiple sources
              for the best deal
            </List.Item>
            <List.Item>
              <b>Real Reviews</b> – Read authentic reviews from previous guests
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
              Search Now
            </Button>
            <Button
              component={Link}
              to="/hotels"
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              View Deals
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
