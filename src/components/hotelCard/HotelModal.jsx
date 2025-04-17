import {
  Modal,
  TextInput,
  MultiSelect,
  Grid,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { fetchAmentiries, fetchLocations } from "../../util/http"; // Import fetchLocations
import ReusableImageUploader from "../../services/ReusableImageUploader";
import { notifications } from "@mantine/notifications";

export default function HotelModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEdit = false,
}) {
  const [hotelData, setHotelData] = useState({
    name: "",
    title: "",
    description: "",
    address: "",
    price: "",
    phone: "",
    email: "",
    policy: "",
    locationId: "",
    avatar: "",
    googleMapEmbed: "",
    latitude: "",
    longitude: "",
    amenities: [],
    images: [],
    ...initialData,
  });

  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]); // State cho danh sách location
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const amenities = await fetchAmentiries();
        setAvailableAmenities(
          amenities.map((amenity) => ({
            value: String(amenity.id),
            label: amenity.name,
          }))
        );

        const locations = await fetchLocations(); // Lấy danh sách location
        setAvailableLocations(
          locations.map((location) => ({
            value: String(location.id),
            label: location.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (updatedFiles) => {
    setHotelData((prev) => ({
      ...prev,
      images: updatedFiles.map((file) => ({
        url: file.url,
        type: file.type || "ROOM",
      })),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(hotelData); // Gọi onSubmit và chờ hoàn thành
      onClose(); // Đóng modal nếu thành công
    } catch (error) {
      // Chỉ hiển thị thông báo lỗi nếu onSubmit ném lỗi
    } finally {
      setIsSubmitting(false); // Đặt trạng thái isSubmitting về false
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Hotel Information" : "Add New Hotel"}
      centered
      size="70%"
    >
      <Grid>
        {/* Name/Title */}
        <Grid.Col span={12}>
          <TextInput
            label={isEdit ? "Title" : "Name"}
            name={isEdit ? "title" : "name"}
            value={isEdit ? hotelData.title : hotelData.name}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Description */}
        <Grid.Col span={12}>
          <TextInput
            label="Description"
            name="description"
            value={hotelData.description}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Address */}
        <Grid.Col span={12}>
          <TextInput
            label="Address"
            name="address"
            value={hotelData.address}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Price */}
        <Grid.Col span={6}>
          <TextInput
            label="Price"
            name="price"
            type="number"
            value={hotelData.price}
            onChange={(e) =>
              setHotelData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value),
              }))
            }
            mb="sm"
          />
        </Grid.Col>

        {/* Phone */}
        <Grid.Col span={6}>
          <TextInput
            label="Phone"
            name="phone"
            value={hotelData.phone}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Email */}
        <Grid.Col span={6}>
          <TextInput
            label="Email"
            name="email"
            value={hotelData.email}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Policy */}
        <Grid.Col span={6}>
          <TextInput
            label="Policy"
            name="policy"
            value={hotelData.policy}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Location (chỉ hiển thị khi isEdit=false) */}
        {!isEdit && (
          <Grid.Col span={12}>
            <Select
              label="Location"
              placeholder="Select a location"
              data={availableLocations}
              value={hotelData.locationId}
              onChange={(value) =>
                setHotelData((prev) => ({
                  ...prev,
                  locationId: value,
                }))
              }
              mb="sm"
            />
          </Grid.Col>
        )}

        {/* Amenities */}
        <Grid.Col span={12}>
          <MultiSelect
            label="Amenities"
            data={availableAmenities}
            value={hotelData.amenities}
            onChange={(value) =>
              setHotelData((prev) => ({
                ...prev,
                amenities: value,
              }))
            }
            mb="sm"
          />
        </Grid.Col>

        {/* Longitude and Latitude */}
        <Grid.Col span={6}>
          <TextInput
            label="Longitude"
            name="longitude"
            type="number"
            value={hotelData.longitude}
            onChange={(e) =>
              setHotelData((prev) => ({
                ...prev,
                longitude: parseFloat(e.target.value),
              }))
            }
            mb="sm"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Latitude"
            name="latitude"
            type="number"
            value={hotelData.latitude}
            onChange={(e) =>
              setHotelData((prev) => ({
                ...prev,
                latitude: parseFloat(e.target.value),
              }))
            }
            mb="sm"
          />
        </Grid.Col>

        {/* Google Map Embed */}
        <Grid.Col span={12}>
          <TextInput
            label="Google Map Embed"
            name="googleMapEmbed"
            value={hotelData.googleMapEmbed}
            onChange={handleInputChange}
            mb="sm"
          />
        </Grid.Col>

        {/* Images */}
        <Grid.Col span={12}>
          <ReusableImageUploader
            initFiles={hotelData.images.map((img) => ({ url: img.url }))}
            onUpload={handleImageUpload}
            multiple={true}
          />
        </Grid.Col>
      </Grid>

      {/* Save and Cancel Buttons */}
      <Group position="right" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isEdit ? "Save Changes" : "Add Hotel"}
        </Button>
      </Group>
    </Modal>
  );
}
