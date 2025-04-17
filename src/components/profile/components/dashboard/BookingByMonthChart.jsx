import { LineChart } from "@mantine/charts";
import { LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { dashboardMonthlyBooking } from "../../../../util/http";

export default function BookingByMonthChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardMonthlyBooking"],
    queryFn: dashboardMonthlyBooking,
  });

  if (isError) {
    return (
      <Text color="red">Failed to load data. Please try again later.</Text>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {!isLoading && data && (
        <LineChart
          h={300}
          data={data}
          series={[{ name: "bookings", label: "Bookings" }]}
          dataKey="date"
          type="gradient"
          gradientStops={[
            { offset: 0, color: "red.6" },
            { offset: 20, color: "orange.6" },
            { offset: 40, color: "yellow.5" },
            { offset: 70, color: "lime.5" },
            { offset: 80, color: "cyan.5" },
            { offset: 100, color: "blue.5" },
          ]}
          strokeWidth={5}
          curveType="natural"
          yAxisProps={{
            domain: [0, Math.max(...data.map((d) => d.bookings)) + 5],
          }}
          valueFormatter={(value) => `${value} `}
          tooltipAnimationDuration={200}
        />
      )}
    </div>
  );
}
