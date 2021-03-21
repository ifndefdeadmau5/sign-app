import { Box, Container, Divider, List, Paper } from "@material-ui/core";
import { useHistory } from "react-router";

const { useQuery, gql } = require("@apollo/client");
const { default: SurveyItem } = require("./LisItem");

const GET_SURVEYS = gql`
  query GetSurveys {
    surveys {
      id
      name
    }
  }
`;

const Surveys = () => {
  const { data } = useQuery(GET_SURVEYS);
  const history = useHistory();
  return (
    <Container maxWidth="sm">
      <Box pt={7}>
        <Paper variant="outlined">
          <List>
            {data &&
              data.surveys.map(({ id, name }, i) => (
                <>
                  <SurveyItem
                    onClick={() => history.push(`/survey/${id}`)}
                    name={name}
                    createdAt={id}
                    imgUrl={`https://picsum.photos/64/64?random=${id}`}
                  />
                  {data.surveys.length - 1 !== i && <Divider />}
                </>
              ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Surveys;
