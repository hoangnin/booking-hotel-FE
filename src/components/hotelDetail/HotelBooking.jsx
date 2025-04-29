import { useState, useRef } from "react"; // Import useRef
import { useDispatch, useSelector } from "react-redux"; // Use Redux for state management
import { useDisclosure } from "@mantine/hooks"; // Import useDisclosure
import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Divider,
  Textarea,
  LoadingOverlay, // Import LoadingOverlay
} from "@mantine/core";
import { IconCalendar, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { checkout } from "../../util/http";
import { notifications } from "@mantine/notifications";
import classes from "./HotelBooking.module.css";
import { openAuthModal } from "../../store/slices/authSlice";

export function HotelBooking({
  pricePerNight,
  rating,
  reviewCount,
  dateRange,
  nights,
  onDateClick,
  hotelId,
}) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [note, setNote] = useState("");
  const [loading, { toggle: toggleLoading }] = useDisclosure(false); // Add loading state
  const serviceCharge = 0;
  const total = pricePerNight * nights + serviceCharge;
  const datePickerRef = useRef(null); // Add a ref for the DatePicker

  const formatDateTime = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(14, 0, 0, 0); // Set time to 14:00:00 UTC
    return formattedDate.toISOString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatRating = (rating) => {
    return Number(rating).toFixed(1);
  };

  const handleReserve = async () => {
    if (!isLoggedIn) {
      dispatch(openAuthModal());
      return;
    }

    if (!dateRange[0] || !dateRange[1]) {
      notifications.show({
        title: "Invalid Date Range",
        message: "Please select a valid check-in and check-out date.",
        color: "red",
      });
      datePickerRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to DatePicker
      onDateClick(); // Trigger the onDateClick function to highlight DatePicker
      return;
    }

    toggleLoading(); // Show loading overlay
    const requestBody = {
      hotelId: hotelId,
      note,
      checkIn: formatDateTime(dateRange[0]), // Format check-in date
      checkOut: formatDateTime(dateRange[1]), // Format check-out date
    };

    try {
      const response = await checkout(requestBody); // Call checkout API
      if (response.paymentUrl) {
        notifications.show({
          classNames: classes,
          title: "Booking Successful",
          message: "Redirecting to payment...",
          icon: <IconCheck size={18} />,
          color: "green",
        });
        window.location.href = response.paymentUrl; // Redirect to payment URL
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      notifications.show({
        classNames: classes,
        title: "Booking Failed",
        message: errorMessage,
        icon: <IconAlertCircle size={18} />,
        color: "red",
      });
    } finally {
      toggleLoading(); // Hide loading overlay
    }
  };

  return (
    <Card withBorder radius="md" className={classes.card}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
      />{" "}
      {/* Add LoadingOverlay */}
      <Text fw={700} fz="xl">
        ${formatPrice(pricePerNight)}/night
      </Text>
      <Group spacing="xs" mt="xs">
        <Badge color="yellow" size="lg">
          {formatRating(rating)}
        </Badge>
        <Text fz="sm" c="dimmed">
          ({reviewCount} reviews)
        </Text>
      </Group>
      <Divider my="sm" />
      <Group
        spacing="sm"
        mt="md"
        onClick={onDateClick}
        onDoubleClick={onDateClick}
        style={{ cursor: "pointer" }}
        ref={datePickerRef} // Attach ref to the DatePicker container
      >
        <IconCalendar size={20} />
        <Text fz="sm">
          {dateRange[0]
            ? `${new Date(dateRange[0]).toLocaleDateString()} - ${new Date(
                dateRange[1]
              ).toLocaleDateString()}`
            : "Select dates"}
        </Text>
      </Group>
      <Divider my="sm" />
      <Group position="apart" mt="md">
        <Text fz="sm">
          ${formatPrice(pricePerNight)} x {nights} night{nights > 1 ? "s" : ""}
        </Text>
        <Text fz="sm">${formatPrice(pricePerNight * nights)}</Text>
      </Group>
      <Group position="apart" mt="xs">
        <Text fz="sm">Service charge</Text>
        <Text fz="sm">${formatPrice(serviceCharge)}</Text>
      </Group>
      <Divider my="sm" />
      <Group position="apart" mt="xs">
        <Text fw={700}>Total</Text>
        <Text fw={700}>${formatPrice(total)}</Text>
      </Group>
      <Textarea
        label="Special Requests"
        description="Add any special requests or notes for your booking"
        placeholder="E.g., Request for a sea view room"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        mt="md"
      />
      <Button radius="xl" fullWidth mt="md" onClick={handleReserve}>
        Reserve
      </Button>
      {/* <Modal
        opened={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login"
      >
        <AuthenticationForm />
      </Modal> */}
    </Card>
  );
}
