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
import Logo from "./image/logo.png";

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
          <Tooltip title="인쇄하기">
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
          <b>비급여 동의서 &</b>
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          <b>주사치료시 발생가능한 부작용에 대한 설명</b>
        </Typography>
        <TableContainer className={classes.firstTable}>
          <Table padding="checkbox" size="small" style={{ whiteSpace: "pre" }}>
            <TableBody>
              <TableRow>
                <TableCell variant="head">등록번호</TableCell>
                <TableCell colSpan={3} style={{ paddingBottom: "4px" }}>
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
                <TableCell variant="head">성명</TableCell>
                <TableCell>
                  <TextField
                    name="name"
                    onChange={handleTextChange}
                    value={state.name}
                    fullWidth
                    {...textFieldParams}
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
                      value="male"
                      control={<Radio />}
                      label="남"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="여"
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
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check1"
                    checked={state.check1}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell rowSpan={8}>기타</TableCell>
                <TableCell>조직재생주사 (DNA)</TableCell>
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
                <TableCell>적외선 체열검사</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check2"
                    checked={state.check2}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>유착박리제</TableCell>
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
                  치료
                </TableCell>
                <TableCell>체외충격파치료</TableCell>
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
                <TableCell>도수치료</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    edit={editMode}
                    checked={state.check5}
                    onChange={handleChange}
                    name="check5"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>혈관 영양주사</TableCell>
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
                <TableCell>대상포진 예방접종</TableCell>
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
                <TableCell>증식치료</TableCell>
                <TableCell {...checkboxCellParams}>
                  <CheckInput
                    name="check7"
                    checked={state.check7}
                    onChange={handleChange}
                    edit={editMode}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>독감 예방접종</TableCell>
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
                <TableCell variant="head">기타</TableCell>
                <TableCell></TableCell>
                <TableCell {...checkboxCellParams}></TableCell>
                <TableCell></TableCell>
                <TableCell>토마스칼라(목보호대)</TableCell>
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
          <li>일시적 통증 악화, 통증의 완화 후 재발 또는 통증의 지속가능성</li>
          <li>주사약물에 의한 알러지 반응, 두통, 저혈압, 호흡곤란, 의식소실</li>
          <li>
            주사치료 부위 감염, 부종, 혈종,어지럼, 목의 불쾌감, 쉰
            목소리,무감각,이상감각, 신경손상, 힘 빠짐
          </li>
          <li>
            흉추부위 주사치료시 아주 드물게(0.25-0.5%) 기흉 발생 -임상증상은
            지금까지 경험하지 못한 극심한 가슴통증과 호흡곤란 -경증은
            산소요법만으로 치료가 가능하나, 흉관삽입 등의 치료가 필요한 경우
            상급병원에서 입원이 필요할 수 있으므로 주사치료 후 상기 증상 시
            본원으로 즉시 연락하고 가까운 으급실에서 진단가 치료를 받으시기
            바랍니다.
          </li>
          <li>
            수술실에서 영상유도하 척추신경 주사치료시 혈전용해제와 아스피린은
            담당주치의 지시에 따라 주사치료 1-7일 전 (혈전용해제에 따라 다름)에
            복용을 중단하고 내원해 주십시요.
          </li>
        </ol>
        <p>
          상기 본인(또는 보호자)은 신경치료의 부작용과 국민건강보험 요양급여가
          적용되지 않는 비급여 진료 행위, 검사, 약제, 및 치료재료를 사용하는
          것에 대해 충분한 설명을 들었으며, 전액 본인부담으로 시행(사용)할 것에
          동의합니다. 또한 동의한 항목에 대해서는 어떠한 민원도 제기하지
          않겠으며, 만약 이를 이행하지 않을 경우 본 동의서를 민원취하서로
          대체하는데 동의합니다.
        </p>

        {/* Sign 하는 부분 */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          p={3}
          position="relative"
        >
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
          <Box
            style={{
              position: "absolute",
              left: 80,
              bottom: 26,
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{
                width: 323,
                height: 62,
              }}
            />
          </Box>
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
              name="relationship"
              value={state.relationship}
              onChange={handleTextChange}
              InputProps={{
                // endAdornment: <span onClick={() => setOpen(true)}>(인)</span>,
                classes: { input: classes.input },
              }}
            />
            {/* {trimmedDataURL ? <SignedImage src={trimmedDataURL} /> : null} */}
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
            완료
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SurveyA;
