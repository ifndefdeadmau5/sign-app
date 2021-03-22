import ReactSignatureCanvas from "react-signature-canvas";
import React, { useRef, useState } from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
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
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Check, CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import { useReducer } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";

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
    <Check fontSize="large" />
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
  registrationNumber: "",
  gender: "male",
};

const Document = () => {
  const classes = useStyles();
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

      dispatch({
        type: "reset",
        payload: { ...initialValues, ...initialState },
      });
      setTrimmedDataURL(survey.signatureDataUrl);
    },
  });
  const [addSurvey, { loading: addSurveyLoading }] = useMutation(ADD_SURVEY);
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
          gender,
          registrationNumber,
          signedBy,
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
    dispatch({ type: "gender", payload: event.target.value });
  };

  const checkboxCellProps = {
    padding: "none",
    align: "center",
  };

  return (
    <Container maxWidth="lg">
      <Box py={10}>
        {(loading || addSurveyLoading) && <LinearProgress />}
        <Typography variant="h4" align="center" gutterBottom>
          비급여 동의서 &
        </Typography>
        <Typography variant="h4" align="center" gutterBottom>
          주사치료시 발생가능한 부작용에 대한 설명
        </Typography>
        <TableContainer className={classes.firstTable}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">등록번호</TableCell>
                <TableCell colSpan={3}>
                  <TextField
                    name="registrationNumber"
                    value={state.registrationNumber}
                    onChange={handleTextChange}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">성명</TableCell>
                <TableCell>
                  <TextField
                    name="name"
                    onChange={handleTextChange}
                    value={state.name}
                    fullWidth
                  />
                </TableCell>
                <TableCell>성별</TableCell>
                <TableCell>
                  <RadioGroup
                    name="gender"
                    value={state.gender}
                    onChange={handleRadioChange}
                    row
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="여"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="남"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>항목</TableCell>
                <TableCell>세부항목</TableCell>
                <TableCell>해당사항</TableCell>
                <TableCell>비고</TableCell>
                <TableCell>항목</TableCell>
                <TableCell>세부항목</TableCell>
                <TableCell>해당사항</TableCell>
                <TableCell>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell variant="head" rowSpan={2}>
                  검사
                </TableCell>
                <TableCell>초음파</TableCell>
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    name="check1"
                    checked={state.check1}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell>9만원</TableCell>
                <TableCell rowSpan={8}>기타</TableCell>
                <TableCell>조직재생주사 (DNA)</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell>적외선 체열검사</TableCell>
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    name="check2"
                    checked={state.check2}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>유착박리제</TableCell>
                <TableCell {...checkboxCellProps}>
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
                  치료
                </TableCell>
                <TableCell>체외충격파치료</TableCell>
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    name="check3"
                    checked={state.check3}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>ATP</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    edit={editMode}
                    checked={state.check4}
                    onChange={handleChange}
                    name="check4"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>vit D</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell>도수치료</TableCell>
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    edit={editMode}
                    checked={state.check5}
                    onChange={handleChange}
                    name="check5"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>혈관 영양주사</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    name="check6"
                    checked={state.check6}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>대상포진 예방접종</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell>증식치료</TableCell>
                <TableCell {...checkboxCellProps}>
                  <CheckInput
                    name="check7"
                    checked={state.check7}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>독감 예방접종</TableCell>
                <TableCell {...checkboxCellProps}>
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
                <TableCell variant="head">기타</TableCell>
                <TableCell></TableCell>
                <TableCell {...checkboxCellProps}></TableCell>
                <TableCell></TableCell>
                <TableCell>토마스칼라(목보호대)</TableCell>
                <TableCell {...checkboxCellProps}>
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
        {/* Sign 하는 부분 */}
        <Box display="flex" flexDirection="column" alignItems="flex-end" p={3}>
          <SignTypo
            style={{ whiteSpace: "pre", marginBottom: 24 }}
            align="right"
          >
            {"2021년          월          일"}
          </SignTypo>

          <Box position="relative" display="flex" alignItems="flex-end" mb={2}>
            <SignTypo onClick={handleOpen}>동의인:</SignTypo>
            <TextField
              name="signedBy"
              value={state.signedBy}
              onChange={handleTextChange}
              InputProps={{
                endAdornment: <span onClick={() => setOpen(true)}>(인)</span>,
                classes: { input: classes.input },
              }}
            />
            {trimmedDataURL ? <SignedImage src={trimmedDataURL} /> : null}
          </Box>
          <Box position="relative" display="flex" alignItems="flex-end">
            <SignTypo onClick={handleOpen}>환자와의 관계:</SignTypo>
            <TextField
              InputProps={{
                endAdornment: <span onClick={() => setOpen(true)}>(인)</span>,
                classes: { input: classes.input },
              }}
            />
            {trimmedDataURL ? <SignedImage src={trimmedDataURL} /> : null}
          </Box>
        </Box>
        <Dialog onClose={() => setOpen(false)} open={open} fullWidth>
          <DialogTitle id="simple-dialog-title">
            서명을 입력해주세요
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
        <Box width={1} display="flex" justifyContent="flex-end" p={5}>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            disableElevation
            size="large"
          >
            완료
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Document;
