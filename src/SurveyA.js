import ReactSignatureCanvas from "react-signature-canvas";
import React, { useRef, useState } from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  Print,
} from "@material-ui/icons";
import { useReducer } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  signPad: {
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
  dialogContent: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderTop: `1px solid ${theme.palette.divider}`,
    height: 150,
    maxWidth: 600,
  },
  input: {
    textAlign: "right",
    paddingRight: theme.spacing(1),
  },
  firstTable: {
    marginBottom: theme.spacing(3),
  },
}));

const TableCell = styled(MuiTableCell)({
  border: "1px solid black",
});

const SignTypo = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  marginRight: theme.spacing(1),
}));

const SignedImage = styled("img")({
  width: "100px",
  height: "25px",
  position: "absolute",
  right: -70,
  bottom: -5,
  pointerEvents: "none",
});

function reducer(state, action) {
  const { type, payload } = action;
  if (type === "reset") return payload;
  return { ...state, [type]: payload };
}

function init(initialState) {
  return initialState;
}

const GET_SURVEY = gql`
  query Survey($id: ID!) {
    survey(id: $id) {
      id
      name
      signatureDataUrl
      result
      registrationNumber
      gender
      signedBy
      relationship
    }
  }
`;

const ADD_SURVEY = gql`
  mutation AddSurvey($input: SurveyInput!) {
    addSurvey(input: $input) {
      id
    }
  }
`;

const CheckInput = ({ edit, ...props }) => {
  return edit ? (
    <Checkbox
      icon={<CheckBoxOutlineBlank fontSize="large" />}
      checkedIcon={<CheckBox fontSize="large" />}
      {...props}
    />
  ) : props.checked ? (
    <Check fontSize="small" />
  ) : null;
};

const initialValues = {
  check1: false,
  check2: false,
  check3: false,
  check4: false,
  check5: false,
  check6: false,
  check7: false,
  check8: false,
  check9: false,
  check10: false,
  check11: false,
  check12: false,
  check13: false,
  check14: false,
  check15: false,
  name: "",
  signedBy: "",
  relationship: "",
  registrationNumber: "",
  gender: "male",
};

const SurveyA = () => {
  const classes = useStyles();
  const history = useHistory();
  const padRef = useRef();
  const [open, setOpen] = useState(false);
  const [trimmedDataURL, setTrimmedDataURL] = useState("");
  const { id } = useParams();
  const { loading, data } = useQuery(GET_SURVEY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ survey }) => {
      const initialState = survey.result
        .split(",")
        .map(Number)
        .reduce(
          (acc, curr, i) => ({
            ...acc,
            [`check${i + 1}`]: Boolean(curr),
          }),
          {}
        );

      initialState.name = survey.name;
      initialState.signedBy = survey.signedBy;
      initialState.relationship = survey.relationship;
      initialState.registrationNumber = survey.registrationNumber;
      initialState.gender = survey.gender;

      dispatch({
        type: "reset",
        payload: { ...initialValues, ...initialState },
      });
      setTrimmedDataURL(survey.signatureDataUrl);
    },
  });
  const [addSurvey, { loading: addSurveyLoading }] = useMutation(ADD_SURVEY, {
    onCompleted: () => {
      history.push("/");
    },
    refetchQueries: ["GetSurveys"],
  });
  const editMode = !data;
  const [state, dispatch] = useReducer(reducer, initialValues, init);

  const onSubmit = () => {
    const {
      check1,
      check2,
      check3,
      check4,
      check5,
      check6,
      check7,
      check8,
      check9,
      check10,
      check11,
      check12,
      check13,
      check14,
      check15,
      name,
      signedBy,
      relationship,
      gender,
      registrationNumber,
    } = state;
    const result = [
      check1,
      check2,
      check3,
      check4,
      check5,
      check6,
      check7,
      check8,
      check9,
      check10,
      check11,
      check12,
      check13,
      check14,
      check15,
    ]
      .map((v) => (v ? "1" : "0"))
      .join(",");

    addSurvey({
      variables: {
        input: {
          name,
          type: "A",
          gender,
          registrationNumber,
          signedBy,
          relationship,
          signatureDataUrl: trimmedDataURL,
          result,
        },
      },
    });
  };

  const trim = () => {
    setTrimmedDataURL(padRef.current.getTrimmedCanvas().toDataURL("image/png"));
  };
  const handleOpen = () => setOpen(true);

  const handleChange = (event) => {
    dispatch({ type: event.target.name, payload: event.target.checked });
  };

  const handleTextChange = (event) => {
    dispatch({ type: event.target.name, payload: event.target.value });
  };

  const handleRadioChange = (event) => {
    if (!editMode) return;
    dispatch({ type: "gender", payload: event.target.value });
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const checkboxCellParams = {
    padding: "none",
    align: "center",
  };

  const textFieldParams = {
    ...(!editMode && {
      InputProps: {
        readOnly: true,
        disableUnderline: true,
      },
    }),
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="flex-end">
        {!editMode && (
          <Tooltip title="????????????">
            <IconButton color="secondary" onClick={handlePrint}>
              <Print />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box
        ref={componentRef}
        width="210mm"
        paddingY={10}
        paddingX={5}
        marginX="auto"
      >
        {(loading || addSurveyLoading) && <LinearProgress />}
        <Typography variant="h6" align="center" gutterBottom>
          ????????? ????????? &
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          ??????????????? ??????????????? ???????????? ?????? ??????
        </Typography>
        <TableContainer className={classes.firstTable}>
          <Table padding="checkbox" size="small" style={{ whiteSpace: "pre" }}>
            <TableBody>
              <TableRow>
                <TableCell variant="head">????????????</TableCell>
                <TableCell colSpan={3}>
                  <TextField
                    name="registrationNumber"
                    value={state.registrationNumber}
                    onChange={handleTextChange}
                    fullWidth
                    {...textFieldParams}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">??????</TableCell>
                <TableCell>
                  <TextField
                    name="name"
                    onChange={handleTextChange}
                    value={state.name}
                    fullWidth
                    {...textFieldParams}
                  />
                </TableCell>
                <TableCell>??????</TableCell>
                <TableCell>
                  <RadioGroup
                    name="gender"
                    value={state.gender}
                    onChange={handleRadioChange}
                    row
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="???"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="???"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table
            aria-label="spanning table"
            padding="checkbox"
            size="small"
            style={{ whiteSpace: "pre" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>??????</TableCell>
                <TableCell>????????????</TableCell>
                <TableCell>????????????</TableCell>
                <TableCell>??????</TableCell>
                <TableCell>??????</TableCell>
                <TableCell>????????????</TableCell>
                <TableCell>????????????</TableCell>
                <TableCell>??????</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell variant="head" rowSpan={2}>
                  ??????
                </TableCell>
                <TableCell>?????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check1"
                    checked={state.check1}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell>9??????</TableCell>
                <TableCell rowSpan={8}>??????</TableCell>
                <TableCell>?????????????????? (DNA)</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check8"
                    checked={state.check8}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>????????? ????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check2"
                    checked={state.check2}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>???????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check9"
                    checked={state.check9}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head" rowSpan={5}>
                  ??????
                </TableCell>
                <TableCell>?????????????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check3"
                    checked={state.check3}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>ATP</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check10"
                    checked={state.check10}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cryotherapy</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    edit={editMode}
                    checked={state.check4}
                    onChange={handleChange}
                    name="check4"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>vit D</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check11"
                    checked={state.check11}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    edit={editMode}
                    checked={state.check5}
                    onChange={handleChange}
                    name="check5"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>?????? ????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check12"
                    checked={state.check12}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Painscrambler</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check6"
                    checked={state.check6}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>???????????? ????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check13"
                    checked={state.check13}
                    onChange={handleChange}
                    checkedIcon={<CheckBox fontSize="large" />}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check7"
                    checked={state.check7}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>?????? ????????????</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check14"
                    checked={state.check14}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">??????</TableCell>
                <TableCell></TableCell>
                <TableCell {...checkboxCellParams}></TableCell>
                <TableCell></TableCell>
                <TableCell>???????????????(????????????)</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check15"
                    checked={state.check15}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ol style={{ margin: 0 }}>
          <li>?????????????????????, ??????????????????????????????????????????????????????</li>
          <li>??????????????? ?????? ????????? ??????, ??????, ?????????, ????????????, ????????????</li>
          <li>
            ???????????? ?????? ??????, ??????, ??????,?????????, ?????? ?????????, ???
            ?????????,?????????,????????????, ????????????, ??? ??????
          </li>
          <li>
            ???????????? ??????????????? ?????? ?????????(0.25-0.5%) ?????? ?????? -???????????????
            ???????????? ???????????? ?????? ????????? ??????????????? ???????????? -?????????
            ????????????????????? ????????? ????????????, ???????????? ?????? ????????? ????????? ??????
            ?????????????????? ????????? ????????? ??? ???????????? ???????????? ??? ?????? ?????? ???
            ???????????? ?????? ???????????? ????????? ??????????????? ????????? ????????? ????????????
            ????????????.
          </li>
          <li>
            ??????????????? ??????????????? ???????????? ??????????????? ?????????????????? ???????????????
            ??????????????? ????????? ?????? ???????????? 1-7??? ??? (?????????????????? ?????? ??????)???
            ????????? ???????????? ????????? ????????????.
          </li>
        </ol>
        <p>
          ?????? ??????(?????? ?????????)??? ??????????????? ???????????? ?????????????????? ???????????????
          ???????????? ?????? ????????? ?????? ??????, ??????, ??????, ??? ??????????????? ????????????
          ?????? ?????? ????????? ????????? ????????????, ?????? ?????????????????? ??????(??????)??? ??????
          ???????????????. ?????? ????????? ????????? ???????????? ????????? ????????? ????????????
          ????????????, ?????? ?????? ???????????? ?????? ?????? ??? ???????????? ??????????????????
          ??????????????? ???????????????.
        </p>

        {/* Sign ?????? ?????? */}
        <Box display="flex" flexDirection="column" alignItems="flex-end" p={3}>
          <SignTypo
            style={{ whiteSpace: "pre", marginBottom: 24 }}
            align="right"
          >
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </SignTypo>
          <Box position="relative" display="flex" alignItems="flex-end" mb={2}>
            <SignTypo onClick={handleOpen}>?????????:</SignTypo>
            <TextField
              name="signedBy"
              value={state.signedBy}
              onChange={handleTextChange}
              InputProps={{
                endAdornment: <span onClick={() => setOpen(true)}>(???)</span>,
                classes: { input: classes.input },
              }}
            />
            {trimmedDataURL ? <SignedImage src={trimmedDataURL} /> : null}
          </Box>
          <Box position="relative" display="flex" alignItems="flex-end">
            <SignTypo onClick={handleOpen}>???????????? ??????:</SignTypo>
            <TextField
              name="relationship"
              value={state.relationship}
              onChange={handleTextChange}
              InputProps={{
                endAdornment: <span onClick={() => setOpen(true)}>(???)</span>,
                classes: { input: classes.input },
              }}
            />
            {trimmedDataURL ? <SignedImage src={trimmedDataURL} /> : null}
          </Box>
        </Box>
        <Dialog onClose={() => setOpen(false)} open={open} fullWidth>
          <DialogTitle id="simple-dialog-title">
            ????????? ??????????????????
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <ReactSignatureCanvas
              penColor="black"
              dotSize={5}
              minWidth={1}
              maxWidth={3}
              canvasProps={{
                className: classes.signPad,
              }}
              ref={padRef}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                trim();
                setOpen(false);
              }}
            >
              Submit
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
      {editMode && (
        <Box width={1} display="flex" justifyContent="flex-end" p={5}>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            disableElevation
            size="large"
          >
            ??????
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SurveyA;
