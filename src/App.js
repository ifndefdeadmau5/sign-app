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
import SurveyA from "./SurveyA";
import SignIn from "./SignIn";
import Surveys from "./Surveys";
import Header from "./Header";
import SignUp from "./SignUp";
import { authVar } from "./cache";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import SurveyB from "./SurveyB";
import SurveyC from "./SurveyC";

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
  const { isAuthenticated } = useReactiveVar(authVar);

  const expireTime = Number(localStorage?.getItem("expireTime"));

  useEffect(() => {
    const now = new Date();
    if (expireTime && new Date(expireTime) < now) {
      authVar({ isAuthenticated: false });
      window.localStorage.clear();
    }
  }, [expireTime]);

  // cache restoration
  useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError = {} }) => {
          const graphQLErrorMessage = graphQLErrors?.[0]?.message ?? "";
          const networkErrorMessage = networkError?.message ?? "";
          const snackbarMessage = networkErrorMessage || graphQLErrorMessage;
          if (graphQLErrors[0].extensions.code === "UNAUTHENTICATED") {
            localStorage.clear();
            authVar({ isAuthenticated: false });
            enqueueSnackbar(
              "인증 토큰이 만료되었습니다. 다시 로그인 해주세요",
              { variant: "error" }
            );
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
  }, [enqueueSnackbar]);

  if (!client) return <span>loading...</span>;

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Header />
        <Switch>
          {isAuthenticated ? (
            <>
              <PrivateRoute path="/survey-a/:id?">
                <SurveyA />
              </PrivateRoute>
              <PrivateRoute path="/survey-b/:id?">
                <SurveyB />
              </PrivateRoute>
              <PrivateRoute path="/survey-c/:id?">
                <SurveyC />
              </PrivateRoute>
              <PrivateRoute exact path="/">
                <Surveys />
              </PrivateRoute>
            </>
          ) : (
            <>
              <Route exact path="/">
                <SignIn />
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
            </>
          )}
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
