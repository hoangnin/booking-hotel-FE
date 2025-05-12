import { Carousel } from "@mantine/carousel";
import { Button, Paper, Text, Title } from "@mantine/core";
import classes from "./CardsCarousel.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

function Card({ image, title, properties, locationId }) {
  const { t } = useTranslation();

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {properties}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Button
        component={Link}
        to={`/hotels?location=${locationId}`}
        variant="white"
        color="dark"
      >
        {t("carousel.explore")}
      </Button>
    </Paper>
  );
}

const data = [
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/One_Pillar_Pagoda_Hanoi.jpg",
    title: "Hà Nội",
    properties: "1,1243000 view",
    locationId: "hanoi",
  },
  {
    image:
      "https://res.klook.com/image/upload/q_85/c_fill,w_750/v1709874860/d0zz5g04ijzulbcazvdm.jpg",
    title: "Đà Nẵng",
    properties: "1243000 view",
    locationId: "danang",
  },
  {
    image:
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2020/07/landmark81.jpg",
    title: "Hồ Chí Minh",
    properties: "2,1243000 view",
    locationId: "hochiminh",
  },
  {
    image:
      "https://vcdn1-dulich.vnecdn.net/2022/07/18/ha-long-quang-ninh-jpeg-9862-1-1398-8445-1658113194.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=v3wvlCTR82KxbKRSn500dw",
    title: "Hạ Long",
    properties: "1243000 view",
    locationId: "halong",
  },
  {
    image:
      "https://vcdn1-dulich.vnecdn.net/2022/04/02/NhaTrangKhanhHoa-1648888103-7869-1648888250.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=DaIvzu7tHOfhuT0SzvZlww",
    title: "Nha Trang",
    properties: "1243000 view",
    locationId: "nhatrang",
  },
  {
    image:
      "https://www.dalattrip.com/dulich/media/2017/12/thanh-pho-da-lat.jpg",
    title: "Đà Lạt",
    properties: "1243000 view",
    locationId: "dalat",
  },
  {
    image:
      "https://blog.premierresidencesphuquoc.com/wp-content/uploads/2025/03/du-lich-phu-quoc-thang-4-22.webp",
    title: "Phú Quốc",
    properties: "1243000 view",
    locationId: "phuquoc",
  },
];

export function CardsCarousel() {
  const autoplayRef = useRef(Autoplay({ delay: 3000 }));

  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize="20%"
      slideGap="md"
      align="start"
      slidesToScroll={1}
      style={{ padding: "0 16px" }}
      loop
      plugins={[autoplayRef.current]}
      onMouseEnter={autoplayRef.current.stop}
      onMouseLeave={autoplayRef.current.reset}
    >
      {slides}
    </Carousel>
  );
}
