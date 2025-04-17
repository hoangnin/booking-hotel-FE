import { DonutChart } from "@mantine/charts";
import { LoadingOverlay, Text, Table, Flex } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  dashboardHotelByLocation,
  dashboardTopHotel,
} from "../../../../util/http";
import { PieChart } from "@mantine/charts";

export default function HotelByLocationChart() {
  const {
    data: topHotelData,
    isLoading: isLoadingTopHotel,
    isError: isErrorTopHotel,
  } = useQuery({
    queryKey: ["dashboardTopHotel"],
    queryFn: dashboardTopHotel,
  });
  const {
    data: locationData,
    isLoading: isLoadingLocation,
    isError: isErrorLocation,
  } = useQuery({
    queryKey: ["dashboardHotelByLocation"],
    queryFn: dashboardHotelByLocation,
  });

  if (isErrorTopHotel || isErrorLocation) {
    return (
      <Text color="red">Failed to load data. Please try again later.</Text>
    );
  }

  if (
    (!topHotelData || topHotelData.length === 0) &&
    (!locationData || Object.keys(locationData).length === 0)
  ) {
    return <Text color="dimmed">No data available to display.</Text>;
  }

  // Chuyển đổi locationData thành mảng các đối tượng
  const locationChartData = locationData
    ? Object.entries(locationData).map(([name, value], index) => ({
        name,
        value,
        color: ["indigo.6", "yellow.6", "teal.6", "gray.6"][index % 4],
      }))
    : [];

  // Tạo các hàng cho bảng từ dữ liệu API
  const rows = topHotelData?.map((hotel, index) => (
    <Table.Tr key={hotel.hotelId}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{hotel.hotelName}</Table.Td>
      <Table.Td>${parseFloat(hotel.revenue).toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isLoadingTopHotel || isLoadingLocation}
        overlayBlur={2}
      />

      {/* 2 chart nằm ngang */}
      <Flex gap="md" justify="center" mb="lg">
        {!isLoadingTopHotel && topHotelData && (
          <DonutChart
            size={120}
            withLabelsLine
            tooltipDataSource="segment"
            labelsType="percent"
            withLabels
            data={topHotelData.map((hotel, index) => ({
              name: hotel.hotelName,
              value: parseFloat(hotel.revenue),
              color: ["indigo.6", "yellow.6", "teal.6", "gray.6"][index % 4],
            }))}
            style={{ flex: 1 }}
          />
        )}

        {!isLoadingLocation && locationChartData.length > 0 && (
          <PieChart
            withTooltip
            tooltipDataSource="segment"
            size={120}
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={locationChartData}
            style={{ flex: 1 }}
          />
        )}
      </Flex>

      <div style={{ maxHeight: 120, overflowY: "auto" }}>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Hotel Name</Table.Th>
              <Table.Th>Revenue</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
