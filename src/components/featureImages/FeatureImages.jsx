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

const data = [
  {
    image: "auditors",
    title: "Easy Booking",
    description: "Simple and quick booking process with just a few clicks",
  },
  {
    image: "lawyers",
    title: "Secure Payment",
    description: "Multiple payment methods with guaranteed security",
  },
  {
    image: "accountants",
    title: "24/7 Support",
    description: "Our support team is always ready to assist you",
  },
  {
    image: "others",
    title: "Great Deals",
    description: "Special promotions and exclusive offers available",
  },
];

export function FeaturesImages() {
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
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Key Features</Text>

      <Title className={classes.title} order={2}>
        Experience <span className={classes.highlight}>Exceptional</span>{" "}
        Booking
      </Title>

      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          We provide you with the easiest and most convenient hotel booking
          experience. With thousands of quality hotels, competitive prices, and
          dedicated support.
        </Text>
      </Container>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
