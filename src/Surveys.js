import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Fab,
  List,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";
import { useHistory } from "react-router";

const { useQuery, gql } = require("@apollo/client");
const { default: SurveyItem } = require("./LisItem");

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
}));

const GET_SURVEYS = gql`
  query GetSurveys {
    surveys {
      id
      name
      createdAt
    }
  }
`;

const Surveys = () => {
  const { data, loading } = useQuery(GET_SURVEYS);
  const history = useHistory();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNewDocumentClick = () => {
    // handleClose();
    history.push("/survey");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="sm">
      <Box pt={7}>
        <Paper variant="outlined">
          {loading && <CircularProgress />}
          <List>
            {data &&
              data.surveys.map(({ id, name, createdAt }, i) => (
                <>
                  <SurveyItem
                    onClick={() => history.push(`/survey/${id}`)}
                    name={name}
                    createdAt={createdAt}
                    imgUrl={`https://picsum.photos/64/64?random=${id}`}
                  />
                  {data.surveys.length - 1 !== i && <Divider />}
                </>
              ))}
          </List>
        </Paper>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleNewDocumentClick}>
          기본 양식으로 새로 만들기
        </MenuItem>
      </Menu>
      <Fab
        onClick={handleClick}
        className={classes.fab}
        color="primary"
        aria-label="add"
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Surveys;
