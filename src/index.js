import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

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

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <App />
      </SnackbarProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
