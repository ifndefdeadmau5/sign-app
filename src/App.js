import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Document from "./Survey";
import SignIn from "./SignIn";
import Surveys from "./Surveys";
import Header from "./Header";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#434C5E",
    },
    secondary: {
      main: "#4C566A",
    },
  },
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route path="/survey/:id?">
              <Document />
            </Route>
            <Route path="/surveys">
              <Surveys />
            </Route>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
