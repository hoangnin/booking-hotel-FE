import { useState, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Pagination,
  Grid,
  Button,
  Group,
  Text,
  Paper,
  Badge,
  Stack,
  Skeleton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import HotelSearchModal from "../common/HotelSearchModal";
import { HotelCard } from "../hotelCard/HotelCard";
import {
  getAllHotels,
  searchHotels,
  getFavorites,
  fetchAddress,
} from "../../util/http";
import { useSelector } from "react-redux";
import { HotelFilters } from "./HotelFilters";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../store/slices/loadingSlice";
import {
  IconMapPin,
  IconHistory,
  IconX,
  IconCurrentLocation,
} from "@tabler/icons-react";

export default function HotelSearchPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    name: "",
    locationId: null,
    checkIn: null,
    checkOut: null,
  });
  const [favorites, setFavorites] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = localStorage.getItem("recentlyViewedHotels");
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [address, setAddress] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Update localStorage when recentlyViewed changes
  useEffect(() => {
    localStorage.setItem(
      "recentlyViewedHotels",
      JSON.stringify(recentlyViewed)
    );
  }, [recentlyViewed]);

  const {
    data: hotels,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotels", page, searchParams],
    queryFn: ({ signal }) => {
      if (
        searchParams.name ||
        searchParams.locationId ||
        searchParams.checkIn ||
        searchParams.checkOut
      ) {
        return searchHotels({
          signal,
          name: searchParams.name,
          locationId: searchParams.locationId,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
        });
      } else {
        return getAllHotels({
          signal,
          page: page - 1,
          size: 12,
          latitude: searchParams.latitude,
          longitude: searchParams.longitude,
        });
      }
    },
  });

  // Fetch favorites when component mounts and when isLoggedIn changes
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (favoritesData) {
      setFavorites(favoritesData);
    }
  }, [favoritesData]);

  useEffect(() => {
    if (hotels) {
      setFilteredHotels(hotels);
    }
  }, [hotels]);

  const handleSearch = (params) => {
    setSearchParams({
      name: params.city,
      locationId: params.locationId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
    });
    setPage(1);
  };

  const handleFindNearby = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setShowLocation(true);
          setIsGeocoding(true);
          const locationName = await fetchAddress(latitude, longitude);
          setAddress(locationName);
          setIsGeocoding(false);
          setSearchParams({
            name: "",
            locationId: null,
            checkIn: null,
            checkOut: null,
            latitude,
            longitude,
          });
          setPage(1);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const handleRecentlyViewed = () => {
    setIsLoading(true);
    if (recentlyViewed.length > 0) {
      setFilteredHotels(recentlyViewed);
      setPage(1);
      setUserLocation(null);
    }
    setIsLoading(false);
  };

  const handleFavoriteChange = (id, isFavorite) => {
    setFavorites((prev) =>
      isFavorite ? [...prev, id] : prev.filter((favId) => favId !== id)
    );
  };

  const handleFilterChange = (filters) => {
    if (!hotels) return;

    const filtered = hotels.filter((hotel) => {
      // Price filter
      const priceInRange =
        hotel.price >= filters.price[0] && hotel.price <= filters.price[1];
      if (!priceInRange) return false;

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hotelAmenities = hotel.amenity.map((a) => a.name);
        const hasAllSelectedAmenities = filters.amenities.every((amenity) =>
          hotelAmenities.includes(amenity)
        );
        if (!hasAllSelectedAmenities) return false;
      }

      // Rating filter
      if (filters.ratings.length > 0) {
        const hotelRating = Math.floor(hotel.rating);
        const passesRatingFilter = filters.ratings.some(
          (rating) => hotelRating >= rating
        );
        if (!passesRatingFilter) return false;
      }

      // Location filter
      if (filters.locations.length > 0) {
        if (!filters.locations.includes(hotel.location)) return false;
      }

      return true;
    });

    setFilteredHotels(filtered);
  };

  const handleViewHotel = (hotel) => {
    setRecentlyViewed((prev) => {
      const newList = prev.filter((h) => h.id !== hotel.id);
      newList.unshift(hotel);
      return newList.slice(0, 10);
    });
  };

  const handleClearSearch = () => {
    setIsLoading(true);
    setSearchParams({
      name: "",
      locationId: null,
      checkIn: null,
      checkOut: null,
    });
    setPage(1);
    setShowLocation(false);
    setUserLocation(null);
    setAddress(null);
    setIsLoading(false);
  };

  if (isPending) {
    dispatch(startLoading());
  } else {
    dispatch(stopLoading());
  }
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Container size="xl" py="xl">
      <Group position="right" mb="md" spacing="md">
        <Button
          leftIcon={<IconHistory size={18} />}
          variant="light"
          onClick={handleRecentlyViewed}
          disabled={recentlyViewed.length === 0}
          loading={isLoading}
        >
          Recently Viewed
        </Button>
        <Button
          leftIcon={<IconMapPin size={18} />}
          variant="light"
          onClick={handleFindNearby}
          loading={isLoading}
        >
          Find hotels near me
        </Button>
        <Button
          leftIcon={<IconX size={18} />}
          variant="light"
          color="red"
          onClick={handleClearSearch}
          loading={isLoading}
        >
          Clear Search
        </Button>
      </Group>
      <HotelSearchModal onSearch={handleSearch} />
      {showLocation && userLocation && (
        <Paper
          shadow="sm"
          p="md"
          radius="md"
          withBorder
          mt="md"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <Group position="apart" align="center">
            <Group spacing="xs">
              <IconCurrentLocation size={20} color="#228be6" />
              <Stack spacing={0}>
                <Text size="sm" weight={500}>
                  Current Location
                </Text>
                {isGeocoding ? (
                  <Skeleton height={16} width={200} />
                ) : (
                  <Text size="xs" color="dimmed">
                    {address || "Loading address..."}
                  </Text>
                )}
              </Stack>
            </Group>
            <Badge
              variant="light"
              color="blue"
              leftSection={<IconMapPin size={12} />}
            >
              Active
            </Badge>
          </Group>
        </Paper>
      )}
      <Grid mt="xl">
        <Grid.Col span={3}>
          <HotelFilters hotels={hotels} onFilterChange={handleFilterChange} />
        </Grid.Col>
        <Grid.Col span={9}>
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            {Array.isArray(filteredHotels) &&
              filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  image={hotel.images[0]?.url}
                  title={hotel.name}
                  description={hotel.description}
                  country={hotel.address}
                  amenity={hotel.amenity}
                  isFavorite={favorites.includes(hotel.id)}
                  onFavoriteChange={handleFavoriteChange}
                  onView={() => handleViewHotel(hotel)}
                />
              ))}
          </SimpleGrid>
          {filteredHotels?.length > 0 && (
            <Pagination
              total={Math.ceil(filteredHotels.length / 12)}
              page={page}
              onChange={setPage}
              mt="xl"
              position="center"
            />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
