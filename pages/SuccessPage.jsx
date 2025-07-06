import { useEffect } from "react";
import { Container, Title, Text, Button, Paper } from "@mantine/core";
import Lottie from "lottie-react";
import successAnimation from "../src/assets/animation/success-animation.json";
import { motion } from "framer-motion";

export default function SuccessPage() {
  useEffect(() => {
    document.title = "Payment Successful";
  }, []);

  return (
    <Container className="flex justify-center items-center h-screen ">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper shadow="md" radius="lg" p="xl" className="text-center w-[360px]">
          <div className="flex justify-center mb-4">
            <Lottie
              animationData={successAnimation}
              style={{ width: 80, height: 80 }}
            />
          </div>
          <Title order={2} className="text-green-600">
            Payment Successful!
          </Title>
          <Text className="mt-2 text-gray-600">
            Thank you for your order. Your order is being processed.
          </Text>
          <Button
            mt="md"
            variant="light"
            color="green"
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
