import {
  Button,
  Container,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { Check, UserPlus, X } from "tabler-icons-react";
import * as yup from "yup";
import { useSignUp } from "../../queries/auth.query";
import { useLoginStyles } from "../../styles/authPage.styles";

function SignUp() {
  const { classes } = useLoginStyles();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const { mutate: registerUser, isLoading } = useSignUp({
    onSuccess: ({ data }) => {
      navigate("/login");
      showNotification({
        title: "Registration Successful",
        message: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: ({ response }) => {
      showNotification({
        title: "Registration Failed",
        message: response.data.message,
        color: "red",
        icon: <X />,
        autoClose: 7500,
      });
    },
  });

  const registerForm = useForm({
    schema: yupResolver(
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
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Container className={classes.container} size="xl" mt={24}>
      <Title order={3}>Create a new Account...</Title>
      <Container
        component="form"
        noValidate
        className={classes.formContainer}
        onSubmit={registerForm.onSubmit(registerUser)}
        py={16}
        px={0}
        size="xl">
        <TextInput
          required
          label="Your full name"
          placeholder="Your full name"
          autoFocus
          size="sm"
          {...registerForm.getInputProps("name")}
        />
        <TextInput
          required
          label="Email ID"
          placeholder="Email ID"
          autoFocus
          size="sm"
          {...registerForm.getInputProps("email")}
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Password"
          size="sm"
          {...registerForm.getInputProps("password")}
        />
        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm Password"
          size="sm"
          {...registerForm.getInputProps("confirmPassword")}
        />
        <Group position="apart">
          <Text
            weight={500}
            color="indigo"
            component={Link}
            to="/login"
            variant="link">
            Login...
          </Text>
          <Button
            size="sm"
            type="submit"
            loading={isLoading}
            leftIcon={<UserPlus />}
            loaderPosition="left"
            ml="auto">
            Sign Up
          </Button>
        </Group>
      </Container>
    </Container>
  );
}

export default SignUp;
