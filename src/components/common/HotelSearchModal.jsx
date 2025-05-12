import { Button, TextInput, Select, Group, Paper } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconMapPin,
  IconSearch,
  IconMoon,
  IconChevronDown,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { useState, useMemo, useEffect } from "react";
import { fetchLocations } from "../../util/http";
import { useTranslation } from "react-i18next";

export default function HotelSearchModal({ onSearch }) {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [nights, setNights] = useState("7");
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  useEffect(() => {
    const fetchLocationsData = async () => {
      try {
        const locationsData = await fetchLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocationsData();
  }, []);

  const checkOutDate = checkIn
    ? new Date(checkIn.getTime() + parseInt(nights) * 24 * 60 * 60 * 1000)
    : null;

  // Generate nights options from 1 to 30
  const nightsOptions = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const nights = i + 1;
      const date = checkIn
        ? new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000)
        : null;
      return {
        value: nights.toString(),
        label: t("hotelSearch.nightsOption", { count: nights }),
        description: date
          ? `${date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}`
          : "",
      };
    });
  }, [checkIn, t]);

  const handleSearch = () => {
    onSearch({
      city,
      locationId: selectedLocationId,
      checkIn,
      checkOut: checkOutDate,
    });
  };

  const handleClearSearch = () => {
    setCity("");
    setCheckIn(null);
    setNights("7");
    setSelectedLocationId(null);
    onSearch({
      city: "",
      locationId: null,
      checkIn: null,
      checkOut: null,
    });
  };

  const inputStyles = {
    root: {
      height: "100%",
    },
    label: {
      marginBottom: 8,
      fontSize: "14px",
    },
    input: {
      height: "45px",
    },
    rightSection: {
      color: "#adb5bd",
      width: 32,
    },
  };

  return (
    <Paper shadow="sm" p="xl" withBorder radius="md">
      <Group align="flex-start" spacing="md" noWrap>
        <TextInput
          label={t("hotelSearch.destinationLabel")}
          icon={<IconMapPin size={18} stroke={1.5} />}
          rightSection={<IconSearch size={16} stroke={1.5} />}
          placeholder={t("hotelSearch.destinationPlaceholder")}
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          styles={inputStyles}
          style={{ flex: 2 }}
        />

        <Select
          label={t("hotelDetail.location")}
          placeholder={t("hotelSearch.selectLocation")}
          data={locations.map((loc) => ({
            value: String(loc.id),
            label: loc.name,
          }))}
          value={selectedLocationId ? String(selectedLocationId) : null}
          onChange={(value) =>
            setSelectedLocationId(value ? Number(value) : null)
          }
          styles={inputStyles}
          style={{ flex: 1 }}
        />

        <DateInput
          label={t("home.checkIn")}
          icon={<IconCalendarEvent size={18} stroke={1.5} />}
          rightSection={<IconClock size={16} stroke={1.5} />}
          placeholder={t("hotelSearch.selectDate")}
          value={checkIn}
          onChange={setCheckIn}
          styles={inputStyles}
          style={{ flex: 1 }}
        />

        <Select
          label={t("hotelSearch.nights")}
          icon={<IconMoon size={18} stroke={1.5} />}
          rightSection={<IconChevronDown size={16} stroke={1.5} />}
          placeholder={t("hotelSearch.selectNights")}
          data={nightsOptions}
          value={nights}
          onChange={setNights}
          styles={{
            ...inputStyles,
            rightSection: {
              ...inputStyles.rightSection,
              pointerEvents: "none",
            },
          }}
          style={{ flex: 1 }}
        />

        <TextInput
          label={t("home.checkOut")}
          icon={<IconCalendarEvent size={18} stroke={1.5} />}
          rightSection={<IconClock size={16} stroke={1.5} />}
          value={checkOutDate?.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
          readOnly
          styles={{
            ...inputStyles,
            input: {
              ...inputStyles.input,
            },
          }}
          style={{ flex: 1 }}
        />

        <Group spacing="xs" style={{ marginTop: "auto" }}>
          <Button
            leftIcon={<IconSearch size={18} stroke={1.5} />}
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSearch}
            size="md"
            style={{ height: 45 }}
          >
            {t("hotelSearch.searchHotels")}
          </Button>
          <Button
            leftIcon={<IconX size={18} stroke={1.5} />}
            variant="light"
            color="red"
            onClick={handleClearSearch}
            size="md"
            style={{ height: 45 }}
          >
            {t("hotelSearch.clear")}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
