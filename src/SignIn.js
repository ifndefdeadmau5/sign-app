import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";

const SignIn = () => {
  const [ID, setID] = useState(""); // ID 의 상태(데이터)를 관리
  const [password, setPassword] = useState(""); // PW 의 상태(데이터)를 관리
  const history = useHistory();

  const handleSubmit = () => {
    history.push("/document");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={12}
      width={600}
      marginX="auto"
    >
      <TextField
        onChange={(e) => {
          setID(e.target.value);
        }}
        label="아이디"
        value={ID}
        variant="filled"
        fullWidth
      />
      <TextField
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        label="패스워드"
        value={password}
        variant="filled"
        fullWidth
      />
      <Button
        variant="contained"
        onClick={() => {
          handleSubmit();
        }}
        fullWidth
      >
        로그인
      </Button>
    </Box>
  );
};

export default SignIn;
