import { Container, Box } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Document from "./Document";
import SignIn from "./SignIn";

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Switch>
          <Route exact path="/">
            <SignIn />
          </Route>
          <Route path="/document">
            <Document />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
