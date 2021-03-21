import {
  AppBar,
  IconButton,
  styled,
  Toolbar,
  Typography,
  Link,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const StyledLink = styled(Link)({
  textDecoration: "none",
});

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
        {/* <StyledLink to="/survey">List</StyledLink> */}
        <Link color="inherit" component={RouterLink} to="/surveys">
          List
        </Link>
      </Typography>
      {/* <Switch value={dark} onChange={(event, checked) => setDark(checked)} /> */}
      {/* <Link to="/cart">
        <IconButton aria-label="cart">
          <Badge badgeContent={items.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Link> */}
    </Toolbar>
  </AppBar>
);

export default Header;
