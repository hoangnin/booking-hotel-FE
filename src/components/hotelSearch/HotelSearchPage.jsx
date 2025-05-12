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
import { useTranslation } from "react-i18next";
import { useLocationLanguage } from "../../hooks/useLocationLanguage";

export default function HotelSearchPage() {
  const { t, i18n } = useTranslation();
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
  const { locationLanguage } = useLocationLanguage();

  useEffect(() => {
    if (locationLanguage && !localStorage.getItem("i18nextLng")) {
      i18n.changeLanguage(locationLanguage);
      console.log(
        `Automatically set language to: ${locationLanguage} in HotelSearchPage`
      );
    }
  }, [locationLanguage, i18n]);

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
          console.log("Find nearby detected location:", locationName);
          setIsGeocoding(false);

          // Thử lấy thông tin chi tiết về vị trí từ Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            console.log("Nominatim data in handleFindNearby:", data);

            // Lấy thành phố và quốc gia
            const country = data.address?.country;
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state;

            console.log(`Detected: City=${city}, Country=${country}`);

            // Bản đồ các thành phố và ngôn ngữ tương ứng
            const cityLangMap = {
              Moscow: "ru",
              "Saint Petersburg": "ru",
              Москва: "ru",
              "Санкт-Петербург": "ru",
              Paris: "fr",
              Lyon: "fr",
              Tokyo: "ja",
              Osaka: "ja",
              Beijing: "zh",
              Shanghai: "zh",
              Seoul: "ko",
              Busan: "ko",
              Hanoi: "vi",
              "Ho Chi Minh": "vi",
              Riyadh: "sa",
            };

            // Bản đồ các quốc gia và ngôn ngữ tương ứng
            const countryLangMap = {
              Russia: "ru",
              "Russian Federation": "ru",
              France: "fr",
              Japan: "ja",
              China: "zh",
              "South Korea": "ko",
              "Korea, Republic of": "ko",
              Vietnam: "vi",
              "Saudi Arabia": "sa",
              "United States": "en",
              "United States of America": "en",
              "United Kingdom": "en",
            };

            let languageDetected = false;

            // Kiểm tra thành phố trước
            if (city) {
              // Kiểm tra khớp chính xác
              if (cityLangMap[city]) {
                i18n.changeLanguage(cityLangMap[city]);
                console.log(
                  `Changed language to ${cityLangMap[city]} based on exact city match: ${city}`
                );
                languageDetected = true;
                // Lưu ngôn ngữ vào sessionStorage
                sessionStorage.setItem("detectedLanguage", cityLangMap[city]);
              } else {
                // Kiểm tra khớp một phần
                for (const [cityKey, lang] of Object.entries(cityLangMap)) {
                  if (city.includes(cityKey) || cityKey.includes(city)) {
                    i18n.changeLanguage(lang);
                    console.log(
                      `Changed language to ${lang} based on partial city match: ${cityKey} in ${city}`
                    );
                    languageDetected = true;
                    // Lưu ngôn ngữ vào sessionStorage
                    sessionStorage.setItem("detectedLanguage", lang);
                    break;
                  }
                }
              }
            }

            // Nếu không tìm thấy từ thành phố, thử từ quốc gia
            if (!languageDetected && country) {
              if (countryLangMap[country]) {
                i18n.changeLanguage(countryLangMap[country]);
                console.log(
                  `Changed language to ${countryLangMap[country]} based on country: ${country}`
                );
                languageDetected = true;
                // Lưu ngôn ngữ vào sessionStorage
                sessionStorage.setItem(
                  "detectedLanguage",
                  countryLangMap[country]
                );
              } else {
                // Kiểm tra khớp một phần
                for (const [countryKey, lang] of Object.entries(
                  countryLangMap
                )) {
                  if (
                    country.includes(countryKey) ||
                    countryKey.includes(country)
                  ) {
                    i18n.changeLanguage(lang);
                    console.log(
                      `Changed language to ${lang} based on partial country match: ${countryKey} in ${country}`
                    );
                    languageDetected = true;
                    // Lưu ngôn ngữ vào sessionStorage
                    sessionStorage.setItem("detectedLanguage", lang);
                    break;
                  }
                }
              }
            }

            // Trường hợp đặc biệt cho Moscow vì nó quan trọng
            if (!languageDetected && locationName) {
              if (
                locationName.includes("Moscow") ||
                locationName.includes("Москва")
              ) {
                i18n.changeLanguage("ru");
                console.log(
                  "Changed language to Russian based on Moscow detection in location name"
                );
                languageDetected = true;
                // Lưu ngôn ngữ vào sessionStorage
                sessionStorage.setItem("detectedLanguage", "ru");
              }
            }
          } catch (err) {
            console.error("Error getting detailed location info:", err);
          }

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
      const priceInRange =
        hotel.price >= filters.price[0] && hotel.price <= filters.price[1];
      if (!priceInRange) return false;

      if (filters.amenities.length > 0) {
        const hotelAmenities = hotel.amenity.map((a) => a.name);
        const hasAllSelectedAmenities = filters.amenities.every((amenity) =>
          hotelAmenities.includes(amenity)
        );
        if (!hasAllSelectedAmenities) return false;
      }

      if (filters.ratings.length > 0) {
        const hotelRating = Math.floor(hotel.rating);
        const passesRatingFilter = filters.ratings.some(
          (rating) => hotelRating >= rating
        );
        if (!passesRatingFilter) return false;
      }

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
  if (isError)
    return (
      <div>
        {t("common.error")}: {error.message}
      </div>
    );

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
          {t("hotelSearch.recentlyViewed")}
        </Button>
        <Button
          leftIcon={<IconMapPin size={18} />}
          variant="light"
          onClick={handleFindNearby}
          loading={isLoading}
        >
          {t("hotelSearch.findNearMe")}
        </Button>
        <Button
          leftIcon={<IconX size={18} />}
          variant="light"
          color="red"
          onClick={handleClearSearch}
          loading={isLoading}
        >
          {t("hotelSearch.clearSearch")}
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
                  {t("hotelSearch.currentLocation")}
                </Text>
                {isGeocoding ? (
                  <Skeleton height={16} width={200} />
                ) : (
                  <Text size="xs" color="dimmed">
                    {address || t("hotelSearch.loadingAddress")}
                  </Text>
                )}
              </Stack>
            </Group>
            <Badge
              variant="light"
              color="blue"
              leftSection={<IconMapPin size={12} />}
            >
              {t("hotelSearch.active")}
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
