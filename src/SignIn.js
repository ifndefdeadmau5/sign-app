import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useHistory } from "react-router";
import { authVar } from "./cache";

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const SignIn = () => {
  const [signIn, { loading }] = useMutation(SIGN_IN, {
    onCompleted: ({ login: token }) => {
      authVar({ isAuthenticated: true });
      window.localStorage.setItem("isAuthenticated", true);
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem(
        "expireTime",
        new Date(decodedToken.exp * 1000).getTime().toString()
      );

      history.push("/");
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn({
      variables: form,
    });
  };

  const handleTextChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" pt={12} marginX="auto">
          {loading && <LinearProgress />}
          <TextField
            autoComplete="email"
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
            type="submit"
            variant="contained"
            color="secondary"
            disableElevation
            disabled={loading}
            fullWidth
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
      </form>
    </Container>
  );
};

export default SignIn;
