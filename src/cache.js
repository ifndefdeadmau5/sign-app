import { makeVar } from "@apollo/client";

export const authVar = makeVar({
  isAuthenticated: false,
});
