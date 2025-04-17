import {
  Card,
  Table,
  Text,
  Title,
  Select,
  Button,
  Group,
  Modal,
  Pagination,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserBooking } from "../../../util/http";
import { isValid, parseISO, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../common/Loading";
import { startLoading, stopLoading } from "../../../store/slices/loadingSlice";

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function BookingHistory() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.isLoggedIn);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dateError, setDateError] = useState("");

  const size = 10;

  const icon = <IconCalendar size={18} stroke={1.5} />;

  const {
    data: bookingsData = {
      content: [],
      totalPages: 1,
      totalElements: 0,
    },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userBookings", userId, page - 1, size], // Include userId in query key
    queryFn: () => getUserBooking({ userId, page: page - 1, size }), // Pass userId to API call
    enabled: !!userId, // Only fetch when userId is available
    keepPreviousData: true,
  });

  const handleFilter = () => {
    // Có thể thêm lọc theo status hoặc ngày sau
  };

  const handleClear = () => {
    setStatusFilter("");
    setFromDate(null);
    setToDate(null);
  };

  const handleView = (booking) => {
    setViewDetails(booking);
    setIsModalOpen(true);
  };

  if (isLoading) {
    dispatch(startLoading());
  } else {
    dispatch(stopLoading());
  }

  if (isError) {
    return <Text>Error loading bookings.</Text>;
  }

  const { content = [], totalPages } = bookingsData;

  const filteredBookings = content.filter((booking) => {
    const matchStatus =
      !statusFilter ||
      booking.status.toLowerCase() === statusFilter.toLowerCase();

    const checkIn = parseISO(booking.checkInDate);
    const matchFromDate =
      !fromDate || (isValid(checkIn) && checkIn >= fromDate);
    const matchToDate = !toDate || (isValid(checkIn) && checkIn <= toDate);

    return matchStatus && matchFromDate && matchToDate;
  });

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md">
        <Title order={2}>Booking History</Title>

        {/* Filters */}
        <div className="mb-6">
          <Group wrap="wrap" gap="md" align="end">
            <Select
              label="Status"
              placeholder="Select status"
              data={["Confirmed", "Pending", "Completed", "Cancelled"]}
              value={statusFilter}
              onChange={setStatusFilter}
              w={200}
              clearable
            />

            <DatePickerInput
              leftSection={icon}
              leftSectionPointerEvents="none"
              label="From Date"
              placeholder="Pick date"
              value={fromDate}
              onChange={setFromDate}
              w={200}
              clearable
            />

            <div
              style={{ display: "flex", flexDirection: "column", width: 200 }}
            >
              <DatePickerInput
                label="To Date"
                placeholder="Pick to date"
                value={toDate}
                onChange={(date) => {
                  setToDate(date);
                  if (fromDate && date && date < fromDate) {
                    setDateError("To Date must be after or equal to From Date");
                  } else {
                    setDateError("");
                  }
                }}
                minDate={fromDate ?? undefined}
                clearable
                error={!!dateError}
              />
              {dateError && (
                <Text size="xs" color="red" mt={2}>
                  {dateError}
                </Text>
              )}
            </div>

            <Group>
              <Button onClick={handleFilter} variant="filled" color="blue">
                Search
              </Button>
              <Button onClick={handleClear} variant="outline" color="gray">
                Clear
              </Button>
            </Group>
          </Group>
        </div>

        {/* Table */}
        <Table striped highlightOnHover withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Hotel Name</Table.Th>
              <Table.Th>Check-In</Table.Th>
              <Table.Th>Check-Out</Table.Th>
              <Table.Th>Total Bill</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredBookings.map((booking) => (
              <Table.Tr key={booking.id}>
                <Table.Td>{booking.id}</Table.Td>
                <Table.Td>{booking.hotelName}</Table.Td>
                <Table.Td>
                  {isValid(parseISO(booking.checkInDate))
                    ? format(parseISO(booking.checkInDate), "dd/MM/yyyy HH:mm")
                    : "Invalid Date"}
                </Table.Td>
                <Table.Td>
                  {isValid(parseISO(booking.checkOutDate))
                    ? format(parseISO(booking.checkOutDate), "dd/MM/yyyy HH:mm")
                    : "Invalid Date"}
                </Table.Td>
                <Table.Td>${booking.totalBill}</Table.Td>
                <Table.Td>
                  <Text
                    color={
                      booking.status.toLowerCase() === "completed"
                        ? "green"
                        : booking.status.toLowerCase() === "cancelled"
                        ? "red"
                        : booking.status.toLowerCase() === "pending"
                        ? "orange"
                        : "blue"
                    }
                    fw={500}
                  >
                    {formatStatus(booking.status)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group spacing="xs">
                    <Button
                      variant="subtle"
                      color="blue"
                      size="xs"
                      onClick={() => handleView(booking)}
                    >
                      View
                    </Button>
                    <Button variant="outline" color="green" size="xs">
                      Re-Book
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          withEdges
          className="mt-4"
        />
      </Card>

      {/* Modal for Viewing Details */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Booking Details"
      >
        {viewDetails && (
          <div>
            <Text>
              <strong>Hotel Name:</strong> {viewDetails.hotelName}
            </Text>
            <Text>
              <strong>Check-In:</strong>{" "}
              {isValid(parseISO(viewDetails.checkInDate))
                ? format(parseISO(viewDetails.checkInDate), "dd/MM/yyyy HH:mm")
                : "Invalid Date"}
            </Text>
            <Text>
              <strong>Check-Out:</strong>{" "}
              {isValid(parseISO(viewDetails.checkOutDate))
                ? format(parseISO(viewDetails.checkOutDate), "dd/MM/yyyy HH:mm")
                : "Invalid Date"}
            </Text>
            <Text>
              <strong>Total Bill:</strong> ${viewDetails.totalBill}
            </Text>
            <Text>
              <strong>Status:</strong> {formatStatus(viewDetails.status)}
            </Text>
            <Text>
              <strong>Note:</strong> {viewDetails.note || "N/A"}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
}
