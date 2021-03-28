import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useReactiveVar,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Document from "./Survey";
import SignIn from "./SignIn";
import Surveys from "./Surveys";
import Header from "./Header";
import SignUp from "./SignUp";
import { authVar } from "./cache";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

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
  const { enqueueSnackbar } = useSnackbar();
  // cache restoration
  useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError = {} }) => {
          const graphQLErrorMessage = graphQLErrors?.[0]?.message ?? "";
          const networkErrorMessage = networkError?.message ?? "";
          const snackbarMessage = networkErrorMessage || graphQLErrorMessage;
          if (graphQLErrorMessage === "Not Authorised!") {
            localStorage.clear();
            authVar({ isAuthenticated: false });
            return;
          } else {
            enqueueSnackbar(snackbarMessage, { variant: "error" });
          }
        }),
        new HttpLink({
          uri: process.env.REACT_APP_GRAPHQL_URL,
          credentials: "include",
        }),
      ]),
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
    </ApolloProvider>
  );
}

export default App;
