import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Button,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { forgotPasswordConfirm } from "../../util/http";
import { useMutation } from "@tanstack/react-query";
import { validatePassword } from "../../util/validation";
import PasswordStrengthChecker from "../common/PasswordStrengthChecker";
import { useDispatch } from "react-redux";
import { openAuthModal } from "../../store/slices/authSlice";

export function ForgotPasswordConfirm() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: validatePassword,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const { mutate: confirmPasswordReset } = useMutation({
    mutationFn: (data) => {
      const token = searchParams.get("token");
      if (!token) throw new Error("Invalid token");
      return forgotPasswordConfirm(token, data);
    },
    onSuccess: (data) => {
      setLoading(false);
      notifications.show({
        title: "Password Reset Successful",
        message:
          data.message ||
          "Your password has been reset successfully. Please login with your new password.",
        color: "green",
      });
      navigate("/");
      dispatch(openAuthModal());
    },
    onError: (error) => {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      notifications.show({
        title: "Password Reset Failed",
        message: errorMessage,
        color: "red",
      });
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      notifications.show({
        title: "Invalid Link",
        message: "This password reset link is invalid or has expired.",
        color: "red",
      });
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const handleSubmit = (values) => {
    setLoading(true);
    confirmPasswordReset({
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Title order={2} ta="center" mt="md" mb={50}>
          Reset Your Password
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PasswordInput
              required
              label="New Password"
              placeholder="Your new password"
              {...form.getInputProps("newPassword")}
              radius="md"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            {isPasswordFocused && (
              <PasswordStrengthChecker password={form.values.newPassword} />
            )}

            <PasswordInput
              required
              label="Confirm New Password"
              placeholder="Confirm your new password"
              {...form.getInputProps("confirmPassword")}
              radius="md"
            />

            <Button type="submit" radius="xl" loading={loading}>
              Reset Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
