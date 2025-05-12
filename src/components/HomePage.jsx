import { HeroBullets } from "./heroHeader/HeroBullets";
import { CardsCarousel } from "./carousel/CardsCarousel";
import { FeaturesImages } from "./featureImages/FeatureImages";
import { HotelCard } from "./hotelCard/HotelCard";
import { Container, SimpleGrid } from "@mantine/core";
import { EmailBanner } from "./emailBaner/Emailbanner";
import { useQuery } from "@tanstack/react-query";
import { fetchHotels, getFavorites } from "../util/http"; // Import getFavorites
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../store/slices/loadingSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { useLocationLanguage } from "../hooks/useLocationLanguage"; // Import custom hook

function Home() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(); // Get i18n instance to change language
  const { locationLanguage, loading: locationLoading } = useLocationLanguage(); // Get language based on location

  // Automatically change language based on location when component mounts
  useEffect(() => {
    if (locationLanguage && !localStorage.getItem("i18nextLng")) {
      // Only change language if user hasn't manually set a language preference
      i18n.changeLanguage(locationLanguage);
      console.log(
        `Automatically set language to: ${locationLanguage} based on geolocation`
      );
    }
  }, [locationLanguage, i18n]);

  const {
    data: hotels,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: ({ signal }) => fetchHotels({ signal }),
  });

  const [favorites, setFavorites] = useState([]); // Track favorite hotel IDs
  const [favoritesLoaded, setFavoritesLoaded] = useState(false); // Track if favorites are loaded
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Fetch favorites when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      const fetchFavorites = async () => {
        try {
          const favoriteIds = await getFavorites(); // Fetch favorite hotel IDs
          setFavorites(favoriteIds);
          setFavoritesLoaded(true); // Mark favorites as loaded
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      };

      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoritesLoaded(true);
    }
  }, [isLoggedIn]);

  const handleFavoriteChange = (id, isFavorite) => {
    setFavorites((prev) =>
      isFavorite ? [...prev, id] : prev.filter((favId) => favId !== id)
    );
  };

  if (isPending || !favoritesLoaded || locationLoading) {
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
    <>
      <HeroBullets />
      <div className="container mx-auto px-4 lg:px-16">
        <CardsCarousel />
      </div>
      <FeaturesImages />
      <Container py="xl" size="xl">
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: "sm", cols: 1 },
            { maxWidth: "md", cols: 2 },
            { maxWidth: "lg", cols: 3 },
          ]}
        >
          {Array.isArray(hotels) &&
            hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                image={hotel.images[0]?.url} // Safely access image URL
                title={hotel.name}
                description={hotel.description}
                country={hotel.address}
                amenity={hotel.amenity}
                isFavorite={favorites.includes(hotel.id)} // Check if hotel is in favorites
                onFavoriteChange={handleFavoriteChange} // Handle favorite changes
              />
            ))}
        </SimpleGrid>
      </Container>
      <Container py="lg" size="xl">
        <EmailBanner />
      </Container>
    </>
  );
}

export default Home;
