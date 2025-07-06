import { useEffect } from "react";
import { Container, Title, Text, Button, Paper } from "@mantine/core";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import cancelAnimation from "../src/assets/animation/cancel-animation.json";

export default function CancelPage() {
  useEffect(() => {
    document.title = "Payment Canceled";
  }, []);

  return (
    <Container className="flex justify-center items-center h-screen ">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          className=" text-center w-[360px]"
        >
          <div className="flex justify-center mb-4">
            <Lottie
              animationData={cancelAnimation}
              style={{ width: 80, height: 80 }}
            />
          </div>
          <Title order={2} className="text-red-600">
            Payment Canceled
          </Title>
          <Text className="mt-2 text-gray-600">
            Your payment was canceled. You can still complete your payment in
            your order history.
          </Text>
          <Button
            mt="md"
            variant="light"
            color="red"
            className="mt-6"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
}
