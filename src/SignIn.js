import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      username
    }
  }
`;

const SignIn = () => {
  const [signIn] = useMutation(SIGN_IN, {
    onCompleted: ({ login }) => {
      if (login !== "false") history.push("/surveys");
    },
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleSubmit = () => {
    signIn({
      variables: form,
    });
  };

  const handleTextChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={12}
        marginX="auto"
      >
        <TextField
          name="email"
          onChange={handleTextChange}
          label="이메일"
          value={form.email}
          variant="filled"
          fullWidth
        />
        <TextField
          name="password"
          type="password"
          onChange={handleTextChange}
          label="패스워드"
          value={form.password}
          variant="filled"
          fullWidth
        />
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          fullWidth
          onClick={() => {
            handleSubmit();
          }}
        >
          로그인
        </Button>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Typography color="textSecondary">
          <i>계정이 없으신가요?</i>
        </Typography>
        <Button
          onClick={() => {
            history.push("/signup");
          }}
        >
          회원가입
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
