import { Card, Group, Image, Text, Badge, Button } from "@mantine/core";
import { useState } from "react";
import { queryClient, updateHotelByOwner } from "../../util/http";
import classes from "./HotelOwnerCard.module.css";
import HotelModal from "./HotelModal"; // Import HotelModal
import { notifications } from "@mantine/notifications";

export default function HotelOwnerCard({
  id,
  images,
  title,
  description,
  address,
  price,
  rating,
  phone,
  email,
  policy,
  amenities,
  longitude,
  latitude,
  googleMapEmbed,
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleSave = async (updatedData) => {
    try {
      const response = await updateHotelByOwner(id, updatedData);
      queryClient.invalidateQueries(["hotelsOwner"]);
      setEditModalOpen(false);
      notifications.show({
        title: "Success",
        message: response.message || "Hotel updated successfully!",
        color: "green",
      });
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message:
          error.response.data.message ||
          "Failed to save hotel. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <>
      {/* Modal chỉnh sửa thông tin khách sạn */}
      <HotelModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSave}
        initialData={{
          title,
          description,
          address,
          price,
          phone,
          email,
          policy,
          amenities: (amenities || []).map((a) => String(a.id)), // Chuyển `id` thành chuỗi
          longitude,
          latitude,
          googleMapEmbed,
          images: images.map((img) => ({ url: img.url, type: img.type })),
        }}
        isEdit={true} // Chế độ chỉnh sửa
      />

      <Card withBorder padding="sm" radius="md" className={classes.card}>
        <Card.Section>
          <Image
            src={images[0]?.url || "https://via.placeholder.com/300"}
            alt={title}
            className={classes.cardImage} // Áp dụng class cardImage
          />
        </Card.Section>

        <div className={classes.cardContent}>
          <Group mt="sm" spacing="xs">
            <Text fw={700} fz="sm" className={classes.title}>
              {title}
            </Text>
            <Badge color="yellow" size="sm">
              {rating > 0 ? `${rating.toFixed(1)}/5` : "No rating"}
            </Badge>
          </Group>

          <Text fz="xs" c="dimmed" mt="xs" lineClamp={2}>
            {description}
          </Text>

          <Text fz="xs" mt="xs">
            Address: {address}
          </Text>

          <Text fw={700} fz="sm" mt="xs">
            ${price.toFixed(2)} / night
          </Text>

          <Button
            fullWidth
            mt="sm"
            onClick={() => setEditModalOpen(true)} // Mở Modal khi nhấn nút Edit
          >
            Edit
          </Button>
        </div>
      </Card>
    </>
  );
}
