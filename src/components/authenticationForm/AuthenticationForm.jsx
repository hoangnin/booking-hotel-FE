import React, { useEffect, useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
  Box,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { TwitterButton } from "./TwitterButton";
import { login, signup, forgotPassword, userInfo } from "../../util/http";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/slices/authSlice";
import classes from "./notification.module.css";
import PasswordStrengthChecker from "../common/PasswordStrengthChecker";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../../util/validation";

export function AuthenticationForm({
  type: initialType,
  onLoginSuccess,
  ...props
}) {
  const [type, toggle] = useToggle(["login", "register"], initialType);
  const [loading, { toggle: toggleLoading }] = useDisclosure(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [
    forgotPasswordOpened,
    { open: openForgotPassword, close: closeForgotPassword },
  ] = useDisclosure(false);
  const dispatch = useDispatch();

  useEffect(() => {
    toggle(initialType);
  }, [initialType, toggle]);

  const loginForm = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: validateUsername,
      password: validatePassword,
    },
  });

  const registerForm = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      terms: false,
    },
    validate: {
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
    },
  });

  const forgotPasswordForm = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: validateEmail,
    },
  });

  const { mutate: loginMutate } = useMutation({
    mutationFn: async (values) => {
      const loginResponse = await login(values);
      const userInfoResponse = await userInfo();
      return userInfoResponse;
    },
    onSuccess: (data) => {
      toggleLoading();
      dispatch(loginAction(data));
      onLoginSuccess?.({
        username: data.username,
        email: data.email,
        avatarUrl: data.avatarUrl,
      });
      notifications.show({
        classNames: classes,
        title: "Login Successful",
        message: "You have logged in successfully!",
      });
    },
    onError: (error) => {
      toggleLoading();
      notifications.show({
        classNames: classes,
        title: "Login Failed",
        message: error?.message || "Invalid credentials. Please try again.",
        color: "red",
      });
    },
  });

  const { mutate: signupMutate } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toggleLoading();
      notifications.show({
        classNames: classes,
        title: "Registration Successful",
        message: "You have registered successfully!",
      });
    },
    onError: (error) => {
      toggleLoading();
      const responseData = error?.response?.data;
      if (responseData && typeof responseData === "object") {
        Object.entries(responseData).forEach(([field, message]) => {
          notifications.show({
            classNames: classes,
            title: `Invalid ${field}`,
            message: message,
            color: "red",
          });
        });
      } else {
        notifications.show({
          classNames: classes,
          title: "Registration Failed",
          message: error?.message || "An error occurred during registration.",
          color: "red",
        });
      }
    },
  });

  const { mutate: forgotPasswordMutate } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toggleLoading();
      closeForgotPassword();
      notifications.show({
        classNames: classes,
        title: "Password Reset Email Sent",
        message:
          data.message ||
          "Please check your email for password reset instructions.",
        color: "green",
      });
    },
    onError: (error) => {
      toggleLoading();
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      notifications.show({
        classNames: classes,
        title: "Failed to Send Reset Email",
        message: errorMessage,
        color: "red",
      });
    },
  });

  const handleSubmit = (values) => {
    toggleLoading();
    if (type === "login") {
      loginMutate(values);
    } else {
      signupMutate(values);
    }
  };

  const handleForgotPassword = (values) => {
    toggleLoading();
    forgotPasswordMutate(values.email);
  };

  const form = type === "login" ? loginForm : registerForm;

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <Button
          variant="default"
          radius="xl"
          onClick={() => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const cleanedBaseUrl = baseUrl.replace(/\/api\/?$/, "");
            window.location.href =
              cleanedBaseUrl + "/oauth2/authorization/google";
          }}
          leftSection={
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
          }
          styles={{
            root: {
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            },
          }}
        >
          Sign in with Google
        </Button>
      </Group>

      <Divider
        label="Or continue with username"
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === "register" && (
            <TextInput
              required
              label="Email"
              placeholder="Your email"
              {...form.getInputProps("email")}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            radius="md"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          {type === "register" && isPasswordFocused && (
            <PasswordStrengthChecker password={form.values.password} />
          )}

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              {...form.getInputProps("terms", { type: "checkbox" })}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Group>
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            {type === "login" && (
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={openForgotPassword}
                size="xs"
              >
                Forgot password?
              </Anchor>
            )}
          </Group>
          <Button
            type="submit"
            radius="xl"
            disabled={type === "register" && !form.values.terms}
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>

      <Modal
        opened={forgotPasswordOpened}
        onClose={closeForgotPassword}
        title="Reset Password"
        centered
      >
        <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="Your email"
              {...forgotPasswordForm.getInputProps("email")}
              radius="md"
            />
            <Button type="submit" radius="xl" loading={loading}>
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
