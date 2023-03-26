import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import PublicGuard from "../guards/PublicGuard";
import { useLoginUser } from "./services";
import { useAuthStyles } from "./styles";
import { loginSchema } from "./utils";

export default function Login() {
  const { classes } = useAuthStyles();
  const { setUserData } = useCurrentUser();
  const navigate = useNavigate();
  const [target, setTarget] = useState("/");
  useDocumentTitle(`${APP_TITLE} | Login`);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      email: "",
      pin: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const { mutate: login, isLoading: loggingIn } = useLoginUser({
    onSuccess: (res) => {
      localStorage.setItem("authToken", res.data?.response?.token);
      setUserData(res.data?.response.user);
      notifications.show({
        title: res.data?.message,
        message: `Welcome, ${res.data?.response?.user.userName}`,
        color: "green",
        icon: <IconCheck />,
      });
      navigate(target);
    },
    onError: (err) => {
      notifications.show({
        message: err.response.data?.message,
        color: "red",
        icon: <IconX />,
      });
    },
  });

  return (
    <PublicGuard>
      <Box
        component="form"
        onSubmit={handleSubmit(login)}
        className={classes.wrapper}
        align="center"
        justify="center"
      >
        <Container size="lg" className={classes.paper}>
          <Text fz="lg" fw="bold" mb="sm">
            Login to your {APP_TITLE} Account
          </Text>
          <Divider mb="sm" />
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
          <Text fw="bold" mb="sm">
            Login To:{" "}
          </Text>
          <Chip.Group
            onChange={setTarget}
            value={target}
            className={classes.chipGroup}
          >
            <Group position="center" spacing="xs" mb="md">
              <Chip variant="filled" value="/">
                Home
              </Chip>
              <Chip variant="filled" value="/expenses">
                Transactions
              </Chip>
              <Chip variant="filled" value="/plans" disabled>
                Plans
              </Chip>
              <Chip variant="filled" value="/account" disabled>
                Account
              </Chip>
            </Group>
          </Chip.Group>
          <Button
            fullWidth
            disabled={!isValid}
            loading={loggingIn}
            type="submit"
            mb="md"
          >
            Login
          </Button>
          <Text align="center" c="orange" td="underline">
            <Text component={Link} to="/register">
              Create a new Account
            </Text>
          </Text>
        </Container>
      </Box>
    </PublicGuard>
  );
}
