import { Button, TextField, Container, Box } from "@material-ui/core";
import { useState } from "react";
import Document from "./Document";

function App() {
  const [ID, setID] = useState(""); // ID 의 상태(데이터)를 관리
  const [password, setPassword] = useState(""); // PW 의 상태(데이터)를 관리

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" pb={2}>
        <TextField
          onChange={(e) => {
            setID(e.target.value);
          }}
          id="filled-name"
          label="아이디"
          value={ID}
          variant="filled"
        />
        <TextField
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          id="filled-name"
          label="패스워드"
          value={password}
          variant="filled"
        />
        <Button
          variant="contained"
          onClick={() => {
            // login 호출
          }}
        >
          로그인
        </Button>
      </Box>
      <Box>
        <Document />
      </Box>
    </Container>
  );
}

export default App;
