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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import { login, signup } from "../../util/http";
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
  const [isPasswordFocused, setPasswordFocused] = useState(false); // State to track password focus
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

  const { mutate: loginMutate } = useMutation({
    mutationFn: login,
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

  const handleSubmit = (values) => {
    toggleLoading();
    if (type === "login") {
      loginMutate(values);
    } else {
      signupMutate(values);
    }
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
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
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
            onFocus={() => setPasswordFocused(true)} // Set focus state
            onBlur={() => setPasswordFocused(false)} // Reset focus state
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
          <Button
            type="submit"
            radius="xl"
            disabled={type === "register" && !form.values.terms}
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Box>
  );
}
