import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useReactiveVar,
} from "@apollo/client";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Document from "./Survey";
import SignIn from "./SignIn";
import Surveys from "./Surveys";
import Header from "./Header";
import SignUp from "./SignUp";
import { authVar } from "./cache";
import { useEffect, useState } from "react";

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

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useReactiveVar(authVar);
  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? children : <Redirect to="/" />)}
    />
  );
}

function App() {
  const [client, setClient] = useState();
  // cache restoration
  useEffect(() => {
    const client = new ApolloClient({
      uri: process.env.REACT_APP_GRAPHQL_URL,
      credentials: "include",
      cache: new InMemoryCache(),
    });

    const isAuthenticated = window.localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      authVar({ isAuthenticated: true });
    }

    setClient(client);
  }, []);

  if (!client) return <span>loading...</span>;

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
            <Route path="/signup">
              <SignUp />
            </Route>
            <PrivateRoute path="/survey/:id?">
              <Document />
            </PrivateRoute>
            <PrivateRoute path="/surveys">
              <Surveys />
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
