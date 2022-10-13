import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Container,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconArrowRight,
  IconCheck,
  IconKey,
  IconMail,
  IconX,
} from "@tabler/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import VersionDisplay from "../../components/versionDisplay/VersionDisplay";
import { APP_TITLE } from "../../constants/app.constants";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useLogin } from "../../services/auth.service";

function Login() {
  const navigate = useNavigate();
  const { onError } = useErrorHandler();
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid Email")
          .required("Email is required"),
        password: yup.string().required("Password is required"),
      })
    ),
  });

  const { mutate: loginUser, isLoading: loggingIn } = useLogin({
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.response.token);
      window.dispatchEvent(new Event("storage"));
      showNotification({
        message: data.message,
        color: "green",
        icon: <IconCheck />,
      });
      setTimeout(() => navigate("/"), 150);
    },
    onError: (err) => {
      onError(err, () =>
        showNotification({
          title: "Login Failed",
          message: err.response.data.message,
          color: "red",
          icon: <IconX />,
        })
      );
    },
  });

  return (
    <>
      <Container
        component="form"
        noValidate
        onSubmit={handleSubmit(loginUser)}
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[6],
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
        })}>
        <Text weight={500}>Login to your account</Text>
        <Divider my="sm" color="indigo" variant="dashed" />
        <TextInput
          label="Email Address"
          icon={<IconMail size={18} />}
          required
          autoFocus
          {...register("email")}
          error={
            dirtyFields.email && touchedFields.email && errors.email?.message
          }
        />
        <PasswordInput
          label="Password"
          icon={<IconKey size={18} />}
          required
          {...register("password")}
          error={
            dirtyFields.password &&
            touchedFields.password &&
            errors.password?.message
          }
        />
        <Group
          align="center"
          position={isSmallScreen ? "center" : "apart"}
          mb={8}>
          <Button
            type="submit"
            loading={loggingIn}
            disabled={!isValid}
            rightIcon={<IconArrowRight size={18} />}
            fullWidth={isSmallScreen}>
            Login
          </Button>
          <Text component="p" my={0}>
            <Text component="span">New to {APP_TITLE}? </Text>
            <Text component={Link} to="/sign-up" weight="bold" color="indigo">
              Create account.
            </Text>
          </Text>
        </Group>
      </Container>
      <VersionDisplay />
    </>
  );
}

export default Login;
