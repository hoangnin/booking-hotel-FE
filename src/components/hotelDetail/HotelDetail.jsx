import {
  Container,
  Grid,
  SimpleGrid,
  Badge,
  Avatar,
  Group,
  Text,
  ActionIcon,
  Card,
  Title,
  Button,
  Table,
  Rating,
  Modal,
  Alert,
  Textarea,
  TextInput,
  Image,
  Overlay,
  UnstyledButton,
  Switch,
  Tooltip,
} from "@mantine/core"; // Import Rating, Modal, and Alert
import { DatePicker } from "@mantine/dates";
import { useState, useRef } from "react"; // Import useState and useRef
import {
  IconEye,
  IconHeart,
  IconShare,
  IconWifi,
  IconBath,
  IconAt,
  IconPhoneCall,
  IconInfoCircle,
  IconArrowDown,
  IconArrowUp,
  IconX,
  IconRotate360,
} from "@tabler/icons-react"; // Fixed icon import
import styles from "./HotelDetail.module.css";
import { HotelBooking } from "./HotelBooking";
import { Faq } from "../faq/Faq";
import { LocationMap } from "../LocationMap"; // Import LocationMap component
import { useQuery } from "@tanstack/react-query";
import {
  fetchHotel,
  fetchOwner,
  fetchReviews,
  createReview,
} from "../../util/http"; // Import fetchOwner and fetchReviews
import { useParams } from "react-router-dom"; // Import useParams
import { MasonryLayout } from "./MasonryLayout"; // Import MasonryLayout component
import { amenityIcons } from "../../constants/amenityIcons"; // Import amenityIcons
import { differenceInDays } from "date-fns"; // Import differenceInDays from date-fns
import { useQueryClient } from "@tanstack/react-query";
import ReusableImageUploader from "../../services/ReusableImageUploader";
import { notifications } from "@mantine/notifications";
import classes from "../authenticationForm/notification.module.css";
import { useTranslation } from "react-i18next"; // Import useTranslation
import React from "react";
// Import our custom PanoramaViewer component instead of react-pannellum directly
import { PanoramaViewer } from "./PanoramaViewer";

export function HotelDetail() {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const { id } = useParams(); // Get id from URL parameters
  const [dateRange, setDateRange] = useState([null, null]); // Updated state for date range
  const [isModalOpen, setIsModalOpen] = useState(false); // State for gallery modal
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track current image index
  const [expandedView, setExpandedView] = useState(false); // New state for expanded view
  const [alertMessage, setAlertMessage] = useState(null); // State for alert message
  const [isPanoramaView, setIsPanoramaView] = useState(false); // State for panorama view
  const datePickerRef = useRef(null); // Ref for DatePicker
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["hotel", id], // Include id in queryKey
    queryFn: ({ signal }) => fetchHotel({ signal, id }), // Pass id to fetchHotel
  });

  const {
    data: reviewsData,
    isPending: isReviewsPending,
    isError: isReviewsError,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", id], // Include hotel id in queryKey
    queryFn: ({ signal }) => fetchReviews({ signal, id }), // Fetch reviews
  });

  if (isPending) return <div>{t("common.loading")}</div>;
  if (isError)
    return (
      <div>
        {t("common.error")}: {error.message}
      </div>
    );

  const {
    name,
    description,
    address,
    phone,
    email,
    rating,
    policy,
    amenity,
    images,
    price,
    bookedDateRange,
    googleMapEmbed,
    ownerId,
  } = data;

  const nights =
    dateRange[0] && dateRange[1]
      ? differenceInDays(new Date(dateRange[1]), new Date(dateRange[0])) || 1
      : 1; // Calculate nights or default to 1

  const handleDateHighlight = () => {
    if (datePickerRef.current) {
      datePickerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }); // Scroll to DatePicker
      datePickerRef.current.classList.add(styles["highlight"]); // Add highlight class
      setTimeout(() => {
        datePickerRef.current.classList.remove(styles["highlight"]); // Remove highlight after 1 second
      }, 1000);
    }
  };

  const isDateInPast = (date) => date < new Date(); // Check if the date is in the past
  const isRangeInvalid = (range) =>
    bookedDateRange.some(
      (booked) =>
        new Date(range[0]) <= new Date(booked.checkOut) &&
        new Date(range[1]) >= new Date(booked.checkIn)
    ); // Check if the range overlaps with booked dates

  const handleDateChange = (range) => {
    if (range[0] && isDateInPast(range[0])) {
      setAlertMessage(t("hotelDetail.dateErrors.pastDate"));
      return;
    }
    if (range[1] && isRangeInvalid(range)) {
      setAlertMessage(t("hotelDetail.dateErrors.bookedDates"));
      return;
    }
    setAlertMessage(null); // Clear alert if the selection is valid
    setDateRange(range);
  };

  const formatRating = (rating) => {
    return Number(rating).toFixed(1);
  };

  const PropertyCard = () => (
    <div className="border border-gray-300 rounded-lg p-6 shadow-md w-full">
      <Badge color="blue" variant="light" className="mb-2">
        {name}
      </Badge>
      <h2 className="text-xl font-semibold mb-1">{description}</h2>
      <Group spacing="xs" className="mb-4">
        <Text size="sm" color="dimmed">
          {formatRating(rating)} ({reviewsData?.length || 0}{" "}
          {t("hotelDetail.reviews")})
        </Text>
        <span className="text-gray-400">•</span>
        <Text size="sm" color="dimmed">
          {address}
        </Text>
      </Group>
      <Group spacing="sm" className="mb-4">
        <Avatar radius="xl" size="sm" />
        <Text size="sm">
          {t("hotelDetail.contact")}: {email}
        </Text>
      </Group>
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <span>📞</span>
          <span>{phone}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>💰</span>
          <span>
            ${price.toFixed(2)} {t("hotel.perNight")}
          </span>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <ActionIcon variant="light" color="blue">
          <IconShare size={16} />
        </ActionIcon>
        <ActionIcon variant="light" color="red">
          <IconHeart size={16} />
        </ActionIcon>
      </div>
    </div>
  );

  const StayInformation = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      className="border border-gray-300 p-6 mb-6"
    >
      <Title order={3} className="mb-2">
        {t("hotelDetail.stayInformation")}
      </Title>
      <Text size="sm" color="dimmed" className="mb-4">
        {policy}
      </Text>
    </Card>
  );

  const Amenities = () => {
    const maxVisibleAmenities = 8; // Maximum number of amenities to display
    const visibleAmenities = amenity.slice(0, maxVisibleAmenities);
    const remainingAmenities = amenity.length - maxVisibleAmenities;

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        className="border border-gray-300 p-6"
      >
        <Title order={3} className="mb-2">
          {t("hotel.amenities")}
        </Title>
        <Text size="sm" color="dimmed" className="mb-4">
          {t("hotelDetail.amenitiesDescription")}
        </Text>
        <SimpleGrid cols={3} spacing="sm" className="mb-4">
          {visibleAmenities.map((item) => (
            <Group spacing="xs" key={item.id}>
              {amenityIcons[item.name] ? (
                <span>{amenityIcons[item.name]}</span>
              ) : null}
              <Text size="sm">{item.name}</Text>
            </Group>
          ))}
        </SimpleGrid>
        {remainingAmenities > 0 && (
          <Button variant="light" color="blue" size="xs">
            {t("hotelDetail.viewMoreAmenities", { count: remainingAmenities })}
          </Button>
        )}
      </Card>
    );
  };

  const RoomRates = () => {
    const weekdayRate = price; // Base price for weekdays
    const weekendRate = price * 1.1; // 10% higher for weekends
    const monthlyDiscount = 0.0834; // 8.34% discount for monthly rent
    const monthlyRate = price * 30 * (1 - monthlyDiscount); // Monthly rate with discount

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        className="border border-gray-300 p-6 mb-6"
      >
        <Title order={3} className="mb-2">
          {t("hotelDetail.roomRates")}
        </Title>
        <Text size="sm" color="dimmed" className="mb-4">
          {t("hotelDetail.priceIncreaseNote")}
        </Text>
        <Table>
          <tbody>
            <tr>
              <td className="py-2">{t("hotelDetail.weekdayRate")}</td>
              <td className="py-2 text-right">${weekdayRate.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2">{t("hotelDetail.weekendRate")}</td>
              <td className="py-2 text-right">${weekendRate.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2">{t("hotelDetail.rentByMonth")}</td>
              <td className="py-2 text-right">
                -${(monthlyDiscount * 100).toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td className="py-2">{t("hotelDetail.monthlyRate")}</td>
              <td className="py-2 text-right">${monthlyRate.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2">{t("hotelDetail.minNights")}</td>
              <td className="py-2 text-right">
                {t("hotelDetail.nightSingular")}
              </td>
            </tr>
            <tr>
              <td className="py-2">{t("hotelDetail.maxNights")}</td>
              <td className="py-2 text-right">
                {t("hotelDetail.nightsPlural", { count: 90 })}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  };

  const Availability = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      className="border border-gray-300 p-6"
    >
      <Title order={3} className="mb-2">
        {t("hotelDetail.availability")}
      </Title>
      <Text size="sm" color="dimmed" className="mb-4">
        {t("hotelDetail.selectDateRange")}
      </Text>
      <div
        ref={datePickerRef} // Attach ref to DatePicker container
        className="flex justify-center space-x-8 mt-4"
      >
        <DatePicker
          type="range"
          numberOfColumns={2}
          value={dateRange}
          onChange={handleDateChange} // Use custom handler
          excludeDate={(date) =>
            isDateInPast(date) ||
            bookedDateRange.some(
              (range) =>
                date >= new Date(range.checkIn) &&
                date <= new Date(range.checkOut)
            )
          } // Disable past and booked dates
        />
      </div>
      {alertMessage && (
        <Alert
          variant="light"
          color="indigo"
          title={t("hotelDetail.invalidSelection")}
          icon={<IconInfoCircle />}
          className="mt-4"
        >
          {alertMessage}
        </Alert>
      )}
      <Text size="sm" color="dimmed" className="mt-4">
        {t("hotelDetail.bookedDatesNote")}
      </Text>
    </Card>
  );

  const HostInformation = () => {
    const {
      data: ownerData,
      isPending,
      isError,
      error,
    } = useQuery({
      queryKey: ["owner", ownerId], // Include ownerId in queryKey
      queryFn: ({ signal }) => fetchOwner({ signal, id: ownerId }), // Fetch owner data
    });

    if (isPending) return <div>{t("hotelDetail.loadingHostInfo")}</div>;
    if (isError)
      return (
        <div>
          {t("hotelDetail.errorHostInfo")}
          {error.message}
        </div>
      );

    // Fallback data
    const fallbackData = {
      avatarUrl: null,
      name: "admin",
      email: "lenin.vn.hn@gmail.com",
      phone: "N/A",
    };

    const { name, email, phone, avatarUrl } = {
      ...fallbackData,
      ...ownerData,
    };

    return (
      <Card
        shadow="sm"
        padding="xl" // Increase padding
        radius="md"
        className="border border-gray-300 p-8 text-center" // Add larger padding and center-align text
      >
        <Title order={2} className="mb-4">
          {t("hotelDetail.hostInformation")}
        </Title>
        <Group justify="center" wrap="nowrap">
          <Avatar
            src={avatarUrl || "https://via.placeholder.com/120"}
            size={120}
            radius="md"
          />
          <div>
            <Text fz="xl" fw={600} className="mt-2">
              {name}
            </Text>
            <Group wrap="nowrap" spacing={10} mt={3} justify="center">
              <IconAt stroke={1.5} size={18} />
              <Text fz="sm" c="dimmed">
                {email}
              </Text>
            </Group>
            <Group wrap="nowrap" spacing={10} mt={5} justify="center">
              <IconPhoneCall stroke={1.5} size={18} />
              <Text fz="sm" c="dimmed">
                {phone}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    );
  };

  const Reviews = () => {
    const [visibleReviews, setVisibleReviews] = useState(6);
    const [reviewFormData, setReviewFormData] = useState({
      rating: 0,
      content: "",
      imageUrl: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewImageToView, setReviewImageToView] = useState(null); // Separate state for review images

    if (isReviewsPending) return <div>{t("hotelDetail.loadingReviews")}</div>;
    if (isReviewsError)
      return (
        <div>
          {t("hotelDetail.errorReviews")}
          {reviewsError.message}
        </div>
      );

    const handleImageUpload = (uploadedFiles) => {
      if (uploadedFiles && uploadedFiles.length > 0) {
        setReviewFormData((prev) => ({
          ...prev,
          imageUrl: uploadedFiles[0].url,
        }));
      }
    };

    const handleReviewSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await createReview({
          rating: reviewFormData.rating,
          content: reviewFormData.content,
          hotelId: id,
          imageUrl: reviewFormData.imageUrl,
        });

        const message =
          response?.message ||
          (typeof response === "string" ? response : JSON.stringify(response));

        if (message.toLowerCase().includes("must booking")) {
          notifications.show({
            title: t("common.error"),
            message: message,
            color: "red",
            autoClose: 5000,
            classNames: classes,
          });
        } else {
          notifications.show({
            title: t("common.success"),
            message: t("hotelDetail.reviewForm.reviewSubmitted"),
            color: "green",
            autoClose: 3000,
            classNames: classes,
          });

          // Reset form
          setReviewFormData({
            rating: 0,
            content: "",
            imageUrl: "",
          });

          // Refetch reviews data
          await queryClient.refetchQueries({ queryKey: ["reviews", id] });
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : JSON.stringify(error?.response?.data)) ||
          error?.message ||
          "Failed to submit review";

        notifications.show({
          title: t("common.error"),
          message: errorMessage,
          color: "red",
          autoClose: 5000,
          classNames: classes,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    const handleLoadMore = () => {
      setVisibleReviews((prev) => prev + 6); // Show 6 more reviews on each click
    };

    const handleShowLess = () => {
      setVisibleReviews(6); // Reset to show only the initial 6 reviews
    };

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        className="border border-gray-300 p-6"
      >
        <Title order={3} className="mb-4">
          {t("hotelDetail.reviews")}
        </Title>

        {/* Review Form */}
        <Card withBorder shadow="sm" radius="md" className="mb-6 p-4">
          <form onSubmit={handleReviewSubmit}>
            <Text size="sm" weight={500} className="mb-2">
              {t("hotelDetail.reviewForm.writeReview")}
            </Text>
            <Rating
              value={reviewFormData.rating}
              onChange={(value) =>
                setReviewFormData((prev) => ({ ...prev, rating: value }))
              }
              size="lg"
              className="mb-3"
            />
            <Textarea
              placeholder={t("hotelDetail.reviewForm.shareExperience")}
              value={reviewFormData.content}
              onChange={(e) =>
                setReviewFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              minRows={3}
              className="mb-3"
              required
            />

            {/* Image Upload Section */}
            <div className="mb-3">
              <Text size="sm" weight={500} className="mb-2">
                {t("hotelDetail.reviewForm.addPhotos")}
              </Text>
              <ReusableImageUploader
                onUpload={handleImageUpload}
                multiple={false}
                initFiles={
                  reviewFormData.imageUrl
                    ? [{ url: reviewFormData.imageUrl }]
                    : []
                }
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!reviewFormData.rating || !reviewFormData.content}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {t("hotelDetail.reviewForm.submitReview")}
            </Button>
          </form>
        </Card>

        {/* Review Stats Section - Add this before the reviews grid */}
        <Card withBorder shadow="sm" radius="md" mb="xl" className="bg-gray-50">
          <Group justify="apart" align="flex-start">
            <div>
              <Text size="xl" weight={700} mb="xs">
                {t("hotelDetail.reviewsCount", { count: reviewsData.length })}
              </Text>
              <Group spacing="xs" align="center">
                <Rating
                  value={
                    reviewsData.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / reviewsData.length
                  }
                  readOnly
                  size="lg"
                />
                <Text size="lg" weight={500}>
                  {formatRating(
                    reviewsData.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / reviewsData.length
                  )}
                </Text>
              </Group>
            </div>

            {/* Rating Distribution */}
            <div style={{ width: "60%" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewsData.filter(
                  (review) => review.rating === star
                ).length;
                const percentage = (count / reviewsData.length) * 100;

                return (
                  <Group key={star} justify="apart" spacing="xs" mb="xs">
                    <Text size="sm" color="dimmed" style={{ width: 50 }}>
                      {t("hotelDetail.starsLabel", { count: star })}
                    </Text>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: "8px",
                          width: "100%",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            backgroundColor: "#228be6",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                    <Text size="sm" color="dimmed" style={{ width: 40 }}>
                      {count}
                    </Text>
                  </Group>
                );
              })}
            </div>
          </Group>
        </Card>

        <SimpleGrid cols={2} spacing="xl">
          {reviewsData.slice(0, visibleReviews).map((review) => (
            <Card
              key={review.id}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              className="transition-shadow hover:shadow-md"
            >
              {/* Header: User Info and Rating */}
              <Group justify="apart" mb="md">
                <Group>
                  <Avatar
                    src={review.userReview.avatar}
                    alt={review.userReview.username}
                    radius="xl"
                    size="md"
                  />
                  <div>
                    <Text size="sm" weight={500}>
                      {review.userReview.username}
                    </Text>
                    <Rating value={review.rating} readOnly size="sm" />
                  </div>
                </Group>
                {/* Có thể thêm ngày review ở đây nếu có */}
                {/* <Text size="xs" color="dimmed">2 days ago</Text> */}
              </Group>

              {/* Review Content */}
              <Text
                size="sm"
                color="dimmed"
                lineClamp={3}
                mb={review.url ? "md" : 0}
              >
                {review.content}
              </Text>

              {/* Review Image */}
              {review.url && (
                <Card.Section mt="md">
                  <Image
                    src={review.url}
                    alt={t("hotelDetail.reviewAttachment")}
                    height={180}
                    onClick={() => setReviewImageToView(review.url)}
                    style={{
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                </Card.Section>
              )}
            </Card>
          ))}
        </SimpleGrid>

        {/* Pagination/Load More Section */}
        {reviewsData.length > 6 && (
          <Group justify="center" mt="xl">
            {visibleReviews < reviewsData.length ? (
              <Button
                variant="light"
                color="blue"
                onClick={handleLoadMore}
                leftSection={<IconArrowDown size={16} />}
              >
                {t("hotelDetail.loadMoreReviews")}
              </Button>
            ) : (
              <Button
                variant="subtle"
                color="gray"
                onClick={handleShowLess}
                leftSection={<IconArrowUp size={16} />}
              >
                {t("hotelDetail.showLess")}
              </Button>
            )}
          </Group>
        )}

        {/* Review Image Modal - Separate from the main image viewer */}
        <Modal
          opened={!!reviewImageToView}
          onClose={() => setReviewImageToView(null)}
          size="lg"
          centered
          withCloseButton={true}
          padding={0}
          styles={{
            close: {
              color: "white",
              background: "rgba(0, 0, 0, 0.5)",
              "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
            },
            header: {
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 10,
              background: "transparent",
              padding: "10px",
            },
            content: { background: "black" },
          }}
        >
          <img
            src={reviewImageToView}
            alt={t("hotelDetail.reviewAttachment")}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        </Modal>
      </Card>
    );
  };

  // Open the gallery modal
  const openGallery = () => {
    setIsModalOpen(true);
    setExpandedView(false);
  };

  // Handle click on image in main HotelDetail view
  const handleMainImageClick = () => {
    openGallery();
  };

  // Function to determine if an image can be viewed in 360° mode
  // In a real app, this would check image metadata or a flag in the database
  const isPanoramaImage = (image) => {
    // Luôn trả về true cho tất cả ảnh để hiển thị button 360°
    return image && image.url ? true : false;
    // Phiên bản cũ:
    // return (
    //   image &&
    //   image.url &&
    //   (image.url.includes("360") ||
    //     image.url.includes("panorama") ||
    //     image.is360 === true)
    // );
  };

  // Handler for toggling panorama view
  const togglePanoramaView = () => {
    if (isPanoramaImage(selectedImage)) {
      setIsPanoramaView(!isPanoramaView);
    } else {
      setIsPanoramaView(false);
      // Optionally show a notification that this image doesn't support 360° view
    }
  };

  // When changing images, check if the new image supports 360° view
  const handleGalleryImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setExpandedView(true);
    // Reset panorama view when changing images
    setIsPanoramaView(false);
  };

  // Update these functions to reset panorama view when navigating
  const handleNextImage = () => {
    if (images && images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
      setCurrentImageIndex(nextIndex);
      setIsPanoramaView(false); // Reset panorama view
    }
  };

  const handlePreviousImage = () => {
    if (images && images.length > 0) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      setSelectedImage(images[prevIndex]);
      setCurrentImageIndex(prevIndex);
      setIsPanoramaView(false); // Reset panorama view
    }
  };

  const closeExpandedView = () => {
    setExpandedView(false);
    setIsPanoramaView(false); // Reset panorama view
  };

  const closeGallery = () => {
    setIsModalOpen(false);
    setExpandedView(false);
    setSelectedImage(null);
    setCurrentImageIndex(null);
    setIsPanoramaView(false); // Reset panorama view
  };

  return (
    <Container my="md" size="xl">
      {/* Increased max width */}
      <div style={{ position: "relative" }}>
        <SimpleGrid cols={2} spacing="md">
          <div
            className={styles["aspect-ratio"]}
            onClick={handleMainImageClick}
            style={{ cursor: "pointer" }}
          >
            <img src={images[0]?.url} alt="Hotel" />
          </div>

          <Grid gutter="md">
            {images.slice(1, 4).map((image, index) => (
              <Grid.Col
                key={index}
                span={index === 0 ? 12 : 6}
                onClick={handleMainImageClick}
                style={{ cursor: "pointer" }}
              >
                <div className={styles["aspect-ratio"]}>
                  <img src={image.url} alt={`Small ${index + 1}`} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
        </SimpleGrid>

        {/* View All Icon */}
        <div
          className={styles["view-all-icon"]}
          onClick={handleMainImageClick} // Open gallery on click
          style={{ cursor: "pointer" }}
        >
          <IconEye size={20} />
        </div>
      </div>

      {/* Gallery Modal - Will show all images initially */}
      <Modal
        opened={isModalOpen && !expandedView}
        onClose={closeGallery}
        size="90%"
        padding="md"
        withCloseButton={true}
        styles={{
          content: { background: "rgba(0, 0, 0, 0.95)" },
          header: { background: "rgba(0, 0, 0, 0.95)" },
          close: { color: "white" },
        }}
      >
        <Title order={2} className="text-white mb-6 ml-4">
          {t("hotelDetail.gallery")} ({images.length})
        </Title>

        <SimpleGrid
          cols={3}
          spacing="md"
          breakpoints={[
            { maxWidth: "sm", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="cursor-pointer transition-transform hover:scale-105 relative"
              onClick={() => handleGalleryImageClick(image, index)}
            >
              <img
                src={image.url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover rounded-md"
              />
              {isPanoramaImage(image) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <IconRotate360 size={18} />
                </div>
              )}
            </div>
          ))}
        </SimpleGrid>
      </Modal>

      {/* Expanded Image Modal */}
      <Modal
        opened={isModalOpen && expandedView}
        onClose={closeExpandedView}
        size="95%"
        padding={0}
        withCloseButton={false}
        styles={{
          content: { background: "rgba(0, 0, 0, 0.98)" },
        }}
      >
        <div className="relative p-4">
          {/* Top controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button variant="subtle" color="gray" onClick={closeExpandedView}>
                {t("hotelDetail.backToGallery")}
              </Button>

              {isPanoramaImage(selectedImage) && (
                <Tooltip
                  label={isPanoramaView ? "Exit 360° view" : "View in 360°"}
                >
                  <Switch
                    checked={isPanoramaView}
                    onChange={togglePanoramaView}
                    label="360° View"
                    color="blue"
                    thumbIcon={
                      isPanoramaView ? (
                        <IconRotate360 size={12} stroke={3} />
                      ) : (
                        <IconEye size={12} stroke={3} />
                      )
                    }
                  />
                </Tooltip>
              )}
            </div>

            <Text
              color="white"
              size="md"
              className="bg-black/30 px-3 py-1 rounded-full"
            >
              {currentImageIndex + 1} / {images.length}
            </Text>

            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={closeGallery}
              radius="xl"
              size="lg"
            >
              <IconX size={18} />
            </ActionIcon>
          </div>

          {/* Image and navigation */}
          <div
            className="relative flex justify-center items-center"
            style={{ minHeight: "70vh" }}
          >
            {!isPanoramaView ? (
              <>
                {/* Left navigation button - positioned absolutely */}
                <div
                  className="absolute left-0 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <ActionIcon
                    variant="filled"
                    color="dark"
                    onClick={handlePreviousImage}
                    radius="xl"
                    size="xl"
                    sx={{
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <IconArrowDown size={24} className="rotate-90" />
                  </ActionIcon>
                </div>

                {/* Main image */}
                <img
                  src={selectedImage?.url}
                  alt={t("hotelDetail.expanded")}
                  className="max-h-[70vh] max-w-full object-contain"
                />

                {/* Right navigation button - positioned absolutely */}
                <div
                  className="absolute right-0 z-10"
                  style={{ transform: "translateX(50%)" }}
                >
                  <ActionIcon
                    variant="filled"
                    color="dark"
                    onClick={handleNextImage}
                    radius="xl"
                    size="xl"
                    sx={{
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <IconArrowDown size={24} className="-rotate-90" />
                  </ActionIcon>
                </div>
              </>
            ) : (
              /* 360° Panorama View */
              <div
                style={{
                  width: "100%",
                  height: "70vh",
                  position: "relative",
                }}
              >
                <PanoramaViewer
                  imageUrl={selectedImage?.url}
                  config={{
                    pitch: 10,
                    yaw: 180,
                    hfov: 110,
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnail strip at bottom */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-2 justify-center">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentImageIndex(idx);
                    setIsPanoramaView(false); // Reset panorama view when changing images
                  }}
                  className={`transition-all duration-200 cursor-pointer relative ${
                    currentImageIndex === idx
                      ? "border-2 border-blue-500 scale-105"
                      : "border border-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`thumbnail ${idx + 1}`}
                    className="h-16 w-24 object-cover"
                  />
                  {isPanoramaImage(img) && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                      <IconRotate360 size={10} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Hotel Information and Booking Section */}
      <Grid gutter="md" mt="md">
        <Grid.Col span={8}>
          {/* Adjusted to occupy 2/3 */}
          <div className={styles["hotel-info"]}>
            <PropertyCard />
            <div className="my-6"></div> {/* Add padding between blocks */}
            <StayInformation /> {/* Add Stay Information */}
            <Amenities /> {/* Add Amenities */}
            <div className="my-6"></div>{" "}
            {/* Add padding between Amenities and RoomRates */}
            <RoomRates /> {/* Add Room Rates */}
            <Availability /> {/* Add Availability */}
            <div className="my-6"></div>{" "}
            {/* Add padding between Availability and HostInformation */}
            <HostInformation /> {/* Add Host Information */}
            <div className="my-6"></div> {/* Add padding between sections */}
            <Reviews /> {/* Add Reviews Section */}
            <div className="my-6"></div> {/* Add padding before map */}
            <Title order={3} className="mb-4">
              {t("hotelDetail.location")}
            </Title>
            <Text size="sm" color="dimmed" className="mb-4">
              {address}
            </Text>
            <LocationMap locationUrl={googleMapEmbed} />
          </div>
        </Grid.Col>
        <Grid.Col span={4}>
          <div className="sticky top-4">
            <HotelBooking
              pricePerNight={price}
              rating={rating}
              reviewCount={reviewsData?.length || 0}
              dateRange={dateRange}
              nights={nights}
              onDateClick={handleDateHighlight}
              hotelId={id}
            />
          </div>
        </Grid.Col>
      </Grid>
      <div className="py-12">
        {/* Add padding top and bottom */}
        <Faq />
      </div>
    </Container>
  );
}
