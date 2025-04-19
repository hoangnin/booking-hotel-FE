import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Avatar,
  Tabs,
  Container,
  SimpleGrid,
  ActionIcon,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconBuilding, IconArrowLeft } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  userInfo as fetchUserInfo,
  getFavorites,
  fetchHotel,
  getHotelByOwner,
  addHotelByOwner,
} from "../../../../util/http";
import { useDispatch, useSelector } from "react-redux";
import { HotelCard } from "../../../hotelCard/HotelCard";
import HotelOwnerCard from "../../../hotelCard/HotelOwnerCard";
import ProfileTabs from "./ProfileInfomationTabs";
import HotelModal from "../../../hotelCard/HotelModal";
import {
  startLoading,
  stopLoading,
} from "../../../../store/slices/loadingSlice";

export default function Infomation() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [profileData, setProfileData] = useState({
    avatar: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });
  const [isHotelOwner, setIsHotelOwner] = useState(false);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => fetchUserInfo(),
    enabled: isLoggedIn,
    retry: 1,
  });

  useEffect(() => {
    if (userData && userData.roles) {
      const hasHotelRole = userData.roles.some(
        (role) => role.name === "ROLE_HOTEL"
      );
      setIsHotelOwner(hasHotelRole);
    }
  }, [userData]);

  const openAddHotelModal = () => setIsAddHotelModalOpen(true);
  const closeAddHotelModal = () => setIsAddHotelModalOpen(false);

  const handleAddHotel = async (newHotelData) => {
    try {
      const formattedData = {
        ...newHotelData,
        price: {
          currency: "VND",
          price: parseFloat(newHotelData.price),
        },
      };

      console.log("Formatted data sent to API:", formattedData);

      await addHotelByOwner(formattedData);
      queryClient.invalidateQueries(["hotelsOwner"]);
      notifications.show({
        title: "Success",
        message: "Hotel added successfully!",
        color: "green",
      });
      closeAddHotelModal();
    } catch (error) {
      console.error("Error adding hotel:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to add hotel. Please try again.",
        color: "red",
      });
    }
  };

  const {
    data: favoriteHotels = [],
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
    error: favoritesError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const favoriteIds = await getFavorites();
      const hotelPromises = favoriteIds.map((id) => fetchHotel({ id }));
      return Promise.all(hotelPromises);
    },
    enabled: isLoggedIn,
    retry: 1,
  });

  const {
    data: hotelsOwner = [],
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useQuery({
    queryKey: ["hotelsOwner"],
    queryFn: async () => {
      const hotelOwnerIds = await getHotelByOwner();
      const hotelOwnerPromises = hotelOwnerIds.map((id) => fetchHotel({ id }));
      return Promise.all(hotelOwnerPromises);
    },
    enabled: isLoggedIn && isHotelOwner,
    retry: 1,
  });

  useEffect(() => {
    if (userData) {
      console.log("User data received:", userData);
      setProfileData({
        avatar: userData.avatarUrl || "https://via.placeholder.com/150",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        role: userData.role || "user",
      });
    }
  }, [userData]);

  const handleFavoriteChange = (id, isFavorite) => {
    if (!isFavorite) {
      queryClient.invalidateQueries(["favorites"]);
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    if (isUserLoading || isFavoritesLoading || isHotelsLoading) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  }, [isUserLoading, isFavoritesLoading, isHotelsLoading, dispatch]);

  if (!isLoggedIn) {
    return <div>Please log in to view your profile</div>;
  }

  if (isUserError || isFavoritesError || isHotelsError) {
    console.error("Error details:", {
      userError,
      favoritesError,
      hotelsError,
    });
    return (
      <div className="p-4">
        <Text color="red" size="lg" weight={500}>
          Error loading user information
        </Text>
        <Text size="sm" color="dimmed" mt="sm">
          {userError?.message ||
            favoritesError?.message ||
            hotelsError?.message}
        </Text>
      </div>
    );
  }

  if (isUserLoading || isFavoritesLoading || isHotelsLoading) {
    return <LoadingOverlay visible={true} />;
  }

  if (isEditing) {
    return (
      <div>
        <ActionIcon
          onClick={toggleEdit}
          size="lg"
          variant="light"
          color="gray"
          className="mb-4"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <ProfileTabs profileData={profileData} />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-md mx-auto rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Avatar src={profileData.avatar} size="xl" radius="xl" />
        </div>
        <form className="space-y-4">
          <TextInput label="Username" value={profileData.username} disabled />
          <TextInput label="Email" value={profileData.email} disabled />
          <TextInput label="Phone" value={profileData.phone} disabled />
          <Group position="right" mt="md">
            <Button
              onClick={toggleEdit}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Edit
            </Button>
          </Group>
        </form>
      </div>

      <Tabs defaultValue="favorite" mt="lg">
        <Tabs.List>
          <Tabs.Tab value="favorite" leftSection={<IconHeart size={12} />}>
            Favorite
          </Tabs.Tab>
          {isHotelOwner && (
            <Tabs.Tab value="hotel" leftSection={<IconBuilding size={12} />}>
              Hotel
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="favorite">
          <Container py="xl" size="xl">
            <SimpleGrid
              cols={4}
              breakpoints={[
                { maxWidth: "sm", cols: 1 },
                { maxWidth: "md", cols: 2 },
                { maxWidth: "lg", cols: 3 },
              ]}
            >
              {favoriteHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  image={
                    hotel?.images?.[0]?.url || "https://via.placeholder.com/300"
                  }
                  title={hotel.name}
                  description={hotel.description}
                  country={hotel.address}
                  amenity={hotel.amenity}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </SimpleGrid>
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="hotel">
          <div className="flex justify-end mb-4">
            <Button
              onClick={openAddHotelModal}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Add Hotel
            </Button>
          </div>
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
              { maxWidth: "lg", cols: 3 },
            ]}
          >
            {hotelsOwner.map((hotel) => (
              <HotelOwnerCard
                key={hotel.id}
                id={hotel.id}
                images={hotel?.images || []}
                title={hotel.name}
                description={hotel.description}
                address={hotel.address}
                price={hotel.price}
                rating={hotel.rating}
                phone={hotel.phone}
                email={hotel.email}
                policy={hotel.policy}
                amenities={hotel?.amenity || []}
                longitude={hotel.longitude}
                latitude={hotel.latitude}
                googleMapEmbed={hotel.googleMapEmbed}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      <HotelModal
        isOpen={isAddHotelModalOpen}
        onClose={closeAddHotelModal}
        onSubmit={handleAddHotel}
        initialData={{
          name: "",
          description: "",
          address: "",
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
          price: {
            currency: "VND",
            price: "",
          },
        }}
        isEdit={false}
      />
    </div>
  );
}
