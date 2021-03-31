import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  List,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, FilterSharp } from "@material-ui/icons";
import { format } from "date-fns";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";

const { gql, useLazyQuery } = require("@apollo/client");
const { default: SurveyItem } = require("./LisItem");

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  dateInput: {
    width: "100%",
    height: "100%",
  },
}));

const GET_SURVEYS = gql`
  query GetSurveys(
    $createdAt: String
    $name: String
    $registrationNumber: String
  ) {
    surveys(
      createdAt: $createdAt
      name: $name
      registrationNumber: $registrationNumber
    ) {
      id
      type
      name
      registrationNumber
      createdAt
    }
  }
`;

const Surveys = () => {
  const history = useHistory();
  const classes = useStyles();
  const [filters, setFilters] = useState({
    name: "",
    registrationNumber: "",
    createdAt: format(new Date(), "yyyy-MM-dd"),
  });
  const [getSurveys, { data, loading }] = useLazyQuery(GET_SURVEYS, {
    fetchPolicy: "cache-and-network",
    variables: {
      createdAt: filters.createdAt,
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSurveyAClick = () => {
    history.push("/survey-a");
  };

  const handleSurveyBClick = () => {
    history.push("/survey-b");
  };

  const handleSurveyCClick = () => {
    history.push("/survey-c");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    getSurveys({
      variables: {
        createdAt: new Date(filters.createdAt).toISOString(),
        name: filters.name,
        registrationNumber: filters.registrationNumber,
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box pt={7}>
        <Paper variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              조건으로 검색
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  name="name"
                  value={filters.name}
                  onChange={handleChange}
                  label="성명"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="registrationNumber"
                  value={filters.registrationNumber}
                  onChange={handleChange}
                  label="등록번호"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <input
                  className={classes.dateInput}
                  name="createdAt"
                  type="date"
                  label="등록일"
                  value={filters.createdAt}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disableElevation
              >
                조회
              </Button>
            </Box>
          </Box>
          {loading && <CircularProgress />}
          <Divider />
          <List>
            {data &&
              data.surveys.map(
                ({ id, name, createdAt, registrationNumber, type }, i) => (
                  <React.Fragment key={id}>
                    <SurveyItem
                      onClick={() =>
                        history.push(`/survey-${type.toLowerCase()}/${id}`)
                      }
                      name={name}
                      createdAt={createdAt}
                      registrationNumber={registrationNumber}
                      imgUrl={`https://picsum.photos/64/64?random=${id}`}
                    />
                    {data.surveys.length - 1 !== i && <Divider />}
                  </React.Fragment>
                )
              )}
          </List>
        </Paper>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSurveyAClick}>
          비급여 동의서 & 주사치료시 발생가능한 부작용에 대한 설명
        </MenuItem>
        <MenuItem onClick={handleSurveyBClick}>
          시술청약서 & 비급여 사전설명 확인서
        </MenuItem>
        <MenuItem onClick={handleSurveyCClick}>
          주사치료 청약서 & 비급여 사전설명 확인서
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
