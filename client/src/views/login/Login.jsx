import {
  Button,
  Container,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { yupResolver, useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { Check, Login as LoginIcon, X } from "tabler-icons-react";
import * as yup from "yup";
import { useLogin } from "../../queries/auth.query";
import { useLoginStyles } from "../../styles/authPage.styles";
import { nonAuthErrorHandler } from "../../utils/app.utils";

function Login() {
  const { classes } = useLoginStyles();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const { mutate: loginUser, isLoading } = useLogin({
    onSuccess: ({ data }) => {
      localStorage.setItem("user", data.response.token);
      navigate("/home");
      showNotification({
        message: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: (err) => {
      nonAuthErrorHandler(err, () =>
        showNotification({
          title: "Login Failed",
          message: err.response.data.message,
          color: "red",
          icon: <X />,
        })
      );
    },
  });

  const loginForm = useForm({
    schema: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid Email")
          .required("Email is required"),
        password: yup.string().required("Password is required"),
      })
    ),
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Container
      component="form"
      noValidate
      onSubmit={loginForm.onSubmit(loginUser)}
      className={classes.container}
      size="xl"
      mt={24}
      px={0}>
      <Title order={3}>Please login to continue...</Title>
      <Container className={classes.formContainer} py={16} px={0} size="xl">
        <TextInput
          required
          label="Email ID"
          placeholder="Email ID"
          autoFocus
          size="sm"
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Password"
          size="sm"
          {...loginForm.getInputProps("password")}
        />
        <Group position="apart">
          <Text
            weight={500}
            color="indigo"
            component={Link}
            to="/sign-up"
            variant="link">
            Create new account...
          </Text>
          <Button
            size="sm"
            type="submit"
            loading={isLoading}
            rightIcon={<LoginIcon style={{ transform: "rotate(180deg)" }} />}
            loaderPosition="left"
            color="indigo"
            ml="auto">
            Login
          </Button>
        </Group>
      </Container>
    </Container>
  );
}

export default Login;
