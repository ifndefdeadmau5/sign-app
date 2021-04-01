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

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!, $username: String) {
    signUp(email: $email, password: $password, username: $username)
  }
`;

const SignUp = () => {
  const [signUp] = useMutation(SIGN_UP, {
    onCompleted: (hasSucceeded) => {
      if (hasSucceeded) history.push("/");
    },
  });
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const history = useHistory();

  const handleSubmit = () => {
    signUp({
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
          name="username"
          onChange={handleTextChange}
          label="닉네임"
          value={form.username}
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
          회원가입
        </Button>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Typography color="textSecondary">
          <i>이미 계정이 있으신가요?</i>
        </Typography>
        <Button
          onClick={() => {
            history.push("/");
          }}
        >
          로그인
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
