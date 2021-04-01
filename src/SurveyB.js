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
  MenuItem,
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
  select: {
    minWidth: 200,
    marginLeft: theme.spacing(2),
  },
  subTitle: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
    textDecoration: "underline",
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
  console.log(action);
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
      name
      signatureDataUrl
      result
      registrationNumber
      gender
      signedBy
      relationship
      doctor
      operation
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
  doctor: "",
  operation: "",
};

const SurveyB = () => {
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
      const { result, ...rest } = survey;
      const initialState = result
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
        payload: { ...initialValues, ...initialState, ...rest },
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
      ...rest
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
          type: "B",
          result,
          signatureDataUrl: trimmedDataURL,
          ...rest,
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
  console.log(state);

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
        paddingTop={3}
        paddingBottom={10}
        paddingX={5}
        marginX="auto"
      >
        {(loading || addSurveyLoading) && <LinearProgress />}
        <Typography variant="h6" align="center" gutterBottom>
          시술청약서 & 비급여 사전설명 확인서
        </Typography>
        <TableContainer className={classes.firstTable}>
          <Table padding="checkbox" size="small">
            <TableBody>
              <TableRow>
                <TableCell variant="head">등록번호</TableCell>
                <TableCell>
                  <TextField
                    name="registrationNumber"
                    value={state.registrationNumber}
                    onChange={handleTextChange}
                    fullWidth
                    {...textFieldParams}
                  />
                </TableCell>
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
              </TableRow>
              <TableRow>
                <TableCell>성별</TableCell>
                <TableCell>
                  {editMode ? (
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
                  ) : (
                    <Typography>
                      {state.gender === "male" ? "남" : "여"}
                    </Typography>
                  )}
                </TableCell>
                <TableCell variant="head">주치의</TableCell>
                <TableCell>
                  {editMode ? (
                    <TextField
                      name="doctor"
                      value={state.doctor}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      select
                      {...textFieldParams}
                    >
                      <MenuItem value={"문동언"}>문동언</MenuItem>
                      <MenuItem value={"배현민"}>배현민</MenuItem>
                    </TextField>
                  ) : (
                    <Typography>{state.doctor}</Typography>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" alignItems="flex-end">
          <Typography className={classes.subTitle}>시술명</Typography>
          {editMode ? (
            <TextField
              className={classes.select}
              name="operation"
              value={state.operation}
              onChange={handleTextChange}
              size="small"
              select
              {...textFieldParams}
            >
              <MenuItem value={"경막 외 신경성형술"}>
                경막 외 신경성형술
              </MenuItem>
              <MenuItem value={"추간공성형술"}>추간공성형술</MenuItem>
              <MenuItem value={"고주파 수핵감압술"}>고주파 수핵감압술</MenuItem>
              <MenuItem value={"경피적 척추성형술"}>경피적 척추성형술</MenuItem>
              <MenuItem value={"고주파열응고술"}>고주파열응고술</MenuItem>
            </TextField>
          ) : (
            <Typography className={classes.select}>
              {state.operation}
            </Typography>
          )}
        </Box>
        <Typography className={classes.subTitle}>
          상기 시술의 위험가능성 및 합병증 설명
        </Typography>
        <ol style={{ margin: 0 }}>
          <li>일시적 통증 악화, 통증 완화 후 재발 또는 지속 가능</li>
          <li>
            시술 후 추가 주사치료 및 지속적인 약물 복용이 필요 할 수 있으며,
            수술이 필요한 경우도 있습니다.
          </li>
          <li>
            알러지 반응(약물, 조영제), 저혈압, 뇌척수액 유출, 두통, 호흡곤란,
            의식소실
          </li>
          <li>
            시술 전 신경손상의 가능성이 있는 경우라면 시술 후 증상이 지속될
            가능성이 있습니다.
          </li>
          <li>시술부위 감염, 혈종, 신경손상, 이상감각, 마비증상</li>
          <li>
            시술 전/ 시술 후 내원시 : 복용하시는 약물 중 아스피린이나 혈전용해제
            등의 약물이 포함되어있는 경우 담당 주치의와 복용중단이 가능한지 확인
            후 시술이나 주사치료 전에 아스피린이나 혈전용해제를 중단 후
            내원해주세요. 혈류개선제(오팔몬, 징코, 오메가3 등) 도 5일간 중단 후
            내원해주세요
          </li>
        </ol>
        <p>
          본인(또는 보호자)은 상기와 같이 시술의 필요성과 그 내용, 예상되는
          합병증 및 후유증에 대하여 의사에게 충분한 설명을 들었으며,
          불가항력적으로 발생할 수 있는 합병증 또는 환자의 특이체질로 우발적
          사고가 일어날 수도 있다는 것을 사전설명으로 충분히 이해하고 위 시술을
          신청합니다.
        </p>
        <Typography className={classes.subTitle}>
          비급여 사전설명 확인서
        </Typography>
        <p style={{ margin: 0, marginBottom: 16 }}>
          본인은 국민건강보험 요양급여가 적용되지 않는{" "}
          <b>
            <u>비급여 진료행위 또는 약제, 치료재료</u>
          </b>
          를 사용하는 것에 대해{" "}
          <b>
            <u>충분히 설명을 듣고</u>
          </b>{" "}
          주치의와 함께 치료방향을 결정하였습니다
        </p>
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
                <TableCell>9만원</TableCell>
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
        {/* Sign 하는 부분 */}
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
        <Box mx="auto" width="fit-content">
          <img src={Logo} alt="logo" style={{ width: 206, height: 62 }} />
        </Box>
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

export default SurveyB;
