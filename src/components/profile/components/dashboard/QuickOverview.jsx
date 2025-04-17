import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoin,
  IconBrandBooking,
  IconReceipt2,
  IconUserPlus,
} from "@tabler/icons-react";
import { Group, Paper, SimpleGrid, Text, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { dashboardOverview } from "../../../../util/http";
import classes from "./QuickOverview.module.css";

const icons = {
  revenue: IconCoin,
  profit: IconReceipt2,
  booking: IconBrandBooking,
  newCustomer: IconUserPlus,
};

export default function QuickOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: dashboardOverview,
  });

  if (isError) {
    return (
      <Text color="red">Failed to load data. Please try again later.</Text>
    );
  }

  // Chuyển đổi dữ liệu thành mảng để dễ xử lý
  const stats = [
    {
      title: "Revenue",
      value: `$${data?.revenue?.toFixed(2) || 0}`,
      diff: data?.revenueDiff || 0,
      icon: "revenue",
    },
    {
      title: "Profit",
      value: `$${data?.profit?.toFixed(2) || 0}`,
      diff: data?.profitDiff || 0,
      icon: "profit",
    },
    {
      title: "Bookings",
      value: data?.booking || 0,
      diff: data?.bookingDiff || 0,
      icon: "booking",
    },
    {
      title: "New Customers",
      value: data?.newCustomer || 0,
      diff: data?.newCustomerDiff || 0,
      icon: "newCustomer",
    },
  ];

  const statCards = stats.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            c={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Paper>
    );
  });

  return (
    <div className={classes.root} style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{statCards}</SimpleGrid>
    </div>
  );
}
