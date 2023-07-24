import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Divider,
  Text,
  TextInput,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PinInput from "../../components/pin-input/PinInput";
import { APP_TITLE, primaryColor } from "../../constants/app";
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
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      userName: "",
      email: "",
      pin: "",
      confirmPin: "",
      timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
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

  const setFieldValue = (name, value) => {
    setValue(name, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

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
            autoFocus
          />
          <TextInput
            {...register("email")}
            placeholder="Email Address"
            label="Email Address"
            error={errors?.email?.message}
            required
          />
          <PinInput
            length={6}
            onChange={(e) => setFieldValue("pin", e)}
            error={errors?.pin?.message}
            label="Create a pin"
            required
          />
          <PinInput
            secret
            length={6}
            onChange={(e) => setFieldValue("confirmPin", e)}
            error={errors?.confirmPin?.message}
            label="Confirm your pin"
            required
          />
          <Text fz="sm" mb="md" align="center">
            <Text component="span" color="dimmed">
              Detected Time Zone:
            </Text>{" "}
            <Text component="span" fw="bold">
              {watch("timeZone")}
            </Text>
          </Text>
          <Button
            fullWidth
            disabled={!isValid}
            loading={registering}
            type="submit"
            mb="md"
          >
            Create Account
          </Button>
          <Text align="center" c={primaryColor} td="underline">
            <Text component={Link} to="/login">
              Login to existing account.
            </Text>
          </Text>
        </Container>
      </Box>
    </PublicGuard>
  );
}
