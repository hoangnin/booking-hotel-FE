import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  RangeSlider,
  Checkbox,
  Stack,
  Group,
  Rating,
  Divider,
} from "@mantine/core";
import { fetchLocations } from "../../util/http";
import { useTranslation } from "react-i18next";

export function HotelFilters({ hotels, onFilterChange }) {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Extract unique amenities from all hotels
  const allAmenities = [
    ...new Set(
      hotels?.flatMap((hotel) => hotel.amenity.map((a) => a.name)) || []
    ),
  ];

  // Fetch locations from API
  useEffect(() => {
    const fetchLocationsData = async () => {
      try {
        const locationsData = await fetchLocations();
        setLocations(locationsData.map((loc) => loc.name));
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocationsData();
  }, []);

  // Find min and max prices
  useEffect(() => {
    if (hotels?.length > 0) {
      const prices = hotels.map((hotel) => hotel.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [hotels]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    applyFilters({ price: value });
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updatedAmenities);
    applyFilters({ amenities: updatedAmenities });
  };

  const handleRatingChange = (rating) => {
    const updatedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updatedRatings);
    applyFilters({ ratings: updatedRatings });
  };

  const handleLocationChange = (location) => {
    const updatedLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];
    setSelectedLocations(updatedLocations);
    applyFilters({ locations: updatedLocations });
  };

  const applyFilters = (changedFilters) => {
    const filters = {
      price: changedFilters.price || priceRange,
      amenities: changedFilters.amenities || selectedAmenities,
      ratings: changedFilters.ratings || selectedRatings,
      locations: changedFilters.locations || selectedLocations,
    };
    onFilterChange(filters);
  };

  return (
    <Paper shadow="xs" p="md" w={300}>
      <Stack spacing="xl">
        {/* Price Range Filter */}
        <div>
          <Text fw={500} mb="xs">
            {t("hotelSearch.priceRange")}
          </Text>
          <RangeSlider
            min={0}
            max={15000}
            value={priceRange}
            onChange={handlePriceChange}
            label={(value) => `$${value}`}
            mb="sm"
          />
          <Group position="apart">
            <Text size="sm">${priceRange[0]}</Text>
            <Text size="sm">${priceRange[1]}</Text>
          </Group>
        </div>

        <Divider />

        {/* Amenities Filter */}
        <div>
          <Text fw={500} mb="xs">
            {t("hotelSearch.facilities")}
          </Text>
          <Stack spacing="xs">
            {allAmenities.map((amenity) => (
              <Checkbox
                key={amenity}
                label={amenity}
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* Rating Filter */}
        <div>
          <Text fw={500} mb="xs">
            {t("hotelSearch.rating")}
          </Text>
          <Stack spacing="xs">
            {[5, 4, 3, 2, 1].map((rating) => (
              <Group key={rating}>
                <Checkbox
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <Rating value={rating} readOnly />
                <Text size="sm">{t("hotelSearch.andUp")}</Text>
              </Group>
            ))}
          </Stack>
        </div>

        <Divider />

        {/* Location Filter */}
        <div>
          <Text fw={500} mb="xs">
            {t("hotelDetail.location")}
          </Text>
          <Stack spacing="xs">
            {locations.map((location) => (
              <Checkbox
                key={location}
                label={location}
                checked={selectedLocations.includes(location)}
                onChange={() => handleLocationChange(location)}
              />
            ))}
          </Stack>
        </div>
      </Stack>
    </Paper>
  );
}
