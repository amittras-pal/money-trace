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
  IconUser,
  IconX,
} from "@tabler/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import VersionDisplay from "../../components/versionDisplay/VersionDisplay";
import { APP_TITLE } from "../../constants/app.constants";
import { useSignUp } from "../../services/auth.service";

function SignUp() {
  const navigate = useNavigate();
  // const { onError } = useErrorHandler();
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const { mutate: registerUser, isLoading: signingUp } = useSignUp({
    onSuccess: ({ data }) => {
      navigate("/login");
      showNotification({
        title: "Registration Successful",
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
        autoClose: 7500,
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup
          .string()
          .email("Invalid Email")
          .required("Email is required"),
        password: yup.string().required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords do not match.")
          .required("Please enter password again."),
      })
    ),
  });

  return (
    <>
      <Container
        component="form"
        noValidate
        onSubmit={handleSubmit(registerUser)}
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[6],
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
        })}>
        <Text weight={500}>Create a new {APP_TITLE} account</Text>
        <Divider my="sm" color="indigo" variant="dashed" />
        <TextInput
          label="Full Name"
          icon={<IconUser size={18} />}
          required
          autoFocus
          {...register("name")}
          error={dirtyFields.name && touchedFields.name && errors.name?.message}
        />
        <TextInput
          label="Email Address"
          icon={<IconMail size={18} />}
          required
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
        <PasswordInput
          label="Password"
          icon={<IconKey size={18} />}
          required
          {...register("confirmPassword")}
          error={
            dirtyFields.confirmPassword &&
            touchedFields.confirmPassword &&
            errors.confirmPassword?.message
          }
        />
        <Group
          align="center"
          position={isSmallScreen ? "center" : "apart"}
          mb={8}>
          <Button
            type="submit"
            loading={signingUp}
            disabled={!isValid}
            rightIcon={<IconArrowRight size={18} />}
            fullWidth={isSmallScreen}>
            Create Account
          </Button>
          <Text component="p" my={0}>
            <Text component="span">Have an Account? </Text>
            <Text component={Link} to="/login" weight="bold" color="indigo">
              Login
            </Text>
          </Text>
        </Group>
      </Container>
      <VersionDisplay />
    </>
  );
}

export default SignUp;
