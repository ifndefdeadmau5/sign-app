import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Link,
  Box,
  Tooltip,
} from "@material-ui/core";
import { ExitToApp, Menu } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { authVar } from "./cache";

const Header = () => {
  const handleLogout = () => {
    authVar({ isAuthenticated: false });
    window.localStorage.clear();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className="button lg xs"
          color="inherit"
          aria-label="menu"
        >
          <Menu />
        </IconButton>
        <Typography variant="body1">
          <Link color="inherit" component={RouterLink} to="/">
            동의서 목록 보기
          </Link>
        </Typography>
        <Box flex={1} />
        <Tooltip title="로그아웃">
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
