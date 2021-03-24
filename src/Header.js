import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Link,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Header = () => (
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
      <Typography variant="h6">
        <Link color="inherit" component={RouterLink} to="/surveys">
          List
        </Link>
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
