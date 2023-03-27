import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Divider,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import PublicGuard from "../guards/PublicGuard";
import { useRegisterUser } from "./services";
import { useAuthStyles } from "./styles";
import { registerSchema } from "./utils";

export default function Register() {
  const { classes } = useAuthStyles();
  const navigate = useNavigate();
  useDocumentTitle(`${APP_TITLE} | Register`);
  const { onError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      userName: "",
      email: "",
      pin: "",
      confirmPin: "",
    },
    resolver: yupResolver(registerSchema),
  });

  const { mutate: registerUser, isLoading: registering } = useRegisterUser({
    onSuccess: (res) => {
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
      navigate("/login");
    },
    onError,
  });

  return (
    <PublicGuard>
      <Box
        component="form"
        onSubmit={handleSubmit(registerUser)}
        className={classes.wrapper}
        align="center"
        justify="center"
      >
        <Container size="lg" className={classes.paper}>
          <Text fz="lg" fw="bold" mb="sm">
            Create a new {APP_TITLE} Account
          </Text>
          <Divider mb="sm" />
          <TextInput
            {...register("userName")}
            placeholder="Full Name"
            label="Full Name"
            error={errors?.userName?.message}
            required
          />
          <TextInput
            {...register("email")}
            placeholder="Email Address"
            label="Email Address"
            error={errors?.email?.message}
            required
          />
          <PasswordInput
            {...register("pin")}
            placeholder="Pin"
            inputMode="numeric"
            label="Pin"
            error={errors?.pin?.message}
            required
          />
          <PasswordInput
            {...register("confirmPin")}
            placeholder="Confirm Pin"
            inputMode="numeric"
            label="Confirm Pin"
            error={errors?.confirmPin?.message}
            required
          />
          <Button
            fullWidth
            disabled={!isValid}
            loading={registering}
            type="submit"
            mb="md"
          >
            Create Account
          </Button>
          <Text align="center" c="orange" td="underline">
            <Text component={Link} to="/login">
              Login to existing account.
            </Text>
          </Text>
        </Container>
      </Box>
    </PublicGuard>
  );
}