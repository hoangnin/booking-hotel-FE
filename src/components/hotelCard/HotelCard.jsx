import { IconHeart } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  Modal,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { addFavorites, deleteFavorites } from "../../util/http";
import { openAuthModal } from "../../store/slices/authSlice";
import classes from "./HotelCard.module.css";
import { amenityIcons } from "../../constants/amenityIcons";
import { useTranslation } from "react-i18next";

export function HotelCard({
  id,
  image,
  title,
  description,
  country,
  amenity = [],
  isFavorite,
  onFavoriteChange,
  onView,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const features =
    amenity?.map((item) => (
      <Badge
        variant="light"
        key={item.name}
        leftSection={amenityIcons[item.name] || "❓"}
      >
        {item.name}
      </Badge>
    )) || [];

  const handleCardClick = () => {
    if (onView) {
      onView();
    }
    navigate(`/hotels/${id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      dispatch(openAuthModal());
      return;
    }

    if (isFavorite) {
      setConfirmModalOpen(true);
    } else {
      try {
        await addFavorites(id);
        notifications.show({
          title: t("common.success"),
          message: t("hotelCard.addedToFavorites"),
          color: "green",
        });
        onFavoriteChange(id, true);
      } catch (error) {
        console.error("Error adding to favorites:", error);
        notifications.show({
          title: t("common.error"),
          message: t("hotelCard.failedToAddFavorites"),
          color: "red",
        });
      }
    }
  };

  const handleConfirmRemove = async () => {
    try {
      await deleteFavorites(id);
      notifications.show({
        title: t("common.success"),
        message: t("hotelCard.removedFromFavorites"),
        color: "green",
      });
      onFavoriteChange(id, false);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      notifications.show({
        title: t("common.error"),
        message: t("hotelCard.failedToRemoveFavorites"),
        color: "red",
      });
    } finally {
      setConfirmModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={t("hotelCard.removeFromFavorites")}
        centered
      >
        <Text>{t("hotelCard.removeConfirmation")}</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setConfirmModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button color="red" onClick={handleConfirmRemove}>
            {t("common.remove")}
          </Button>
        </Group>
      </Modal>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className={classes.card}
        onClick={handleCardClick}
      >
        <Card.Section>
          <Image src={image} height={160} alt={title} />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{title}</Text>
          <ActionIcon
            variant="subtle"
            color={isFavorite ? "red" : "gray"}
            onClick={handleFavoriteClick}
          >
            <IconHeart size={18} />
          </ActionIcon>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        <Text size="sm" c="dimmed" mt="xs">
          {country}
        </Text>

        <Group gap="xs" mt="md">
          {features}
        </Group>
      </Card>
    </>
  );
}
