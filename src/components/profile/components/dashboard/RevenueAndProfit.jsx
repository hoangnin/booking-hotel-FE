import { CompositeChart } from "@mantine/charts";
import { LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { dashboardCombineChart } from "../../../../util/http";

export default function RevenueAndProfit() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardCombineChart"],
    queryFn: dashboardCombineChart,
  });

  if (isError) {
    return (
      <Text color="red">Failed to load data. Please try again later.</Text>
    );
  }

  if (!data || data.length === 0) {
    return <Text color="dimmed">No data available to display.</Text>;
  }

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {!isLoading && (
        <CompositeChart
          h={300}
          data={data}
          dataKey="date"
          maxBarWidth={30}
          tooltipAnimationDuration={200}
          series={[
            { name: "Revenue", color: "blue.6", type: "bar", yAxisId: "left" },
            { name: "Profit", color: "green.6", type: "line", yAxisId: "left" },
            {
              name: "Bookings",
              color: "orange.6",
              type: "area",
              yAxisId: "right",
            },
          ]}
          strokeWidth={2}
          yAxes={[
            {
              id: "left",
              orientation: "left",
              label: "Amount ($)",
              tickFormatter: (value) => `$${value.toLocaleString()}`,
            },
            {
              id: "right",
              orientation: "right",
              label: "Bookings",
              tickFormatter: (value) => value.toLocaleString(),
            },
          ]}
        />
      )}
    </div>
  );
}
