import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Container,
  Group,
  PasswordInput,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../services/auth.service";
import * as yup from "yup";
import { useQueryClient } from "react-query";

export default function ChangePassword() {
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const navigate = useNavigate();
  const client = useQueryClient();

  const { mutate, isLoading: changing } = useChangePassword({
    onSuccess: ({ data }) => {
      navigate("/login");
      localStorage.clear();
      client.clear();
      window.dispatchEvent(new Event("storage"));
      showNotification({
        title: "Password Changed Successfully",
        message: data.message,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError: ({ response }) => {
      showNotification({
        title: "Registration Failed",
        message: response.data.message,
        color: "red",
        icon: <IconX />,
        autoClose: 3500,
      });
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().required("Password is required"),
        newPassword: yup.string().required("Must add a new Password"),
        confirmNewPassword: yup
          .string()
          .oneOf([yup.ref("newPassword"), null], "Passwords do not match.")
          .required("Please enter password again."),
      })
    ),
  });

  const confirmPasswordChange = (values) => {
    openConfirmModal({
      children: (
        <Text weight="bold">
          Once you change the password, you will be logged out and you need to
          login again with your new password.
        </Text>
      ),
      title: "Confirm Password Change",
      labels: { confirm: "Change Password", cancel: "Cancel" },
      confirmProps: { color: "red", m: 4 },
      cancelProps: { variant: "subtle", color: "gray", m: 4 },
      withCloseButton: false,
      onConfirm: () => mutate(values),
      onCancel: reset,
      closeOnCancel: true,
      closeOnClickOutside: false,
      closeOnEscape: false,
    });
  };

  return (
    <Container
      size={"md"}
      px={0}
      component="form"
      noValidate
      onSubmit={handleSubmit(confirmPasswordChange)}>
      <PasswordInput
        label="Current Password"
        placeholder="Enter Current Password"
        required
        autoFocus
        {...register("password")}
        error={
          dirtyFields.password &&
          touchedFields.password &&
          errors.password?.message
        }
      />
      <PasswordInput
        label="New Password"
        placeholder="Create New Password"
        required
        {...register("newPassword")}
        error={
          dirtyFields.newPassword &&
          touchedFields.newPassword &&
          errors.newPassword?.message
        }
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm New Password"
        required
        {...register("confirmNewPassword")}
        error={
          dirtyFields.confirmNewPassword &&
          touchedFields.confirmNewPassword &&
          errors.confirmNewPassword?.message
        }
      />
      <Group position="right" mt="xs">
        <Button
          type="submit"
          fullWidth={isMobile}
          disabled={!isValid}
          loading={changing}>
          Change Password
        </Button>
      </Group>
    </Container>
  );
}
