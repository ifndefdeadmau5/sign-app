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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Check, CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import { useReducer } from "react";

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
  return { ...state, [type]: payload };
}

const CheckInput = ({ edit, ...props }) => {
  return edit ? (
    <Checkbox
      icon={<CheckBoxOutlineBlank fontSize="large" />}
      checkedIcon={<CheckBox fontSize="large" />}
      {...props}
    />
  ) : (
    <Check fontSize="large" />
  );
};

const Document = () => {
  const classes = useStyles();
  const padRef = useRef();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    state1: false,
    state2: false,
    state3: false,
    state4: false,
    state5: false,
  });
  const [trimmedDataURL, setTrimmedDataURL] = useState("");

  const trim = () => {
    // pad 에 싸인한거를 이미지로 얻어오겠다
    setTrimmedDataURL(padRef.current.getTrimmedCanvas().toDataURL("image/png"));
  };
  const handleOpen = () => setOpen(true);

  const handleChange = (event) => {
    dispatch({ type: event.target.name, payload: event.target.checked });
  };

  const checkboxCellProps = {
    padding: "none",
    align: "center",
  };

  const handleEditModeChange = (event) => {
    setEdit(event.target.checked);
  };

  return (
    <Box pt={20}>
      <FormControlLabel
        // value="편집 모드"
        control={<Switch checked={edit} onChange={handleEditModeChange} />}
        label="편집 모드"
        labelPlacement="start"
      />

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
                  name="state1"
                  value={state.state1}
                  onChange={handleChange}
                  edit={edit}
                />
              </TableCell>
              <TableCell>9만원</TableCell>
              <TableCell rowSpan={8}>기타</TableCell>
              <TableCell>조직재생주사 (DNA)</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>적외선 체열검사</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput
                  icon={<CheckBoxOutlineBlank fontSize="large" />}
                  edit={edit}
                  checkedIcon={<CheckBox fontSize="large" />}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>유착박리제</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head" rowSpan={5}>
                치료
              </TableCell>
              <TableCell>체외충격파치료</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput
                  checkedIcon={<CheckBox fontSize="large" />}
                  edit={edit}
                  name="state3"
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>ATP</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cryotherapy</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput
                  checkedIcon={<CheckBox fontSize="large" />}
                  edit={edit}
                  name="state4"
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>vit D</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>도수치료</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput
                  checkedIcon={<CheckBox fontSize="large" />}
                  edit={edit}
                  name="state5"
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>혈관 영양주사</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput name="checkedI" edit={edit} />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Painscrambler</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput name="checkedI" edit={edit} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>대상포진 예방접종</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput name="checkedI" edit={edit} />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>증식치료</TableCell>
              <TableCell {...checkboxCellProps}>
                <CheckInput
                  icon={<CheckBoxOutlineBlank fontSize="large" />}
                  checkedIcon={<CheckBox fontSize="large" />}
                  name="checkedI"
                  edit={edit}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>독감 예방접종</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">기타</TableCell>
              <TableCell></TableCell>
              <TableCell {...checkboxCellProps}></TableCell>
              <TableCell></TableCell>
              <TableCell>토마스칼라(목보호대)</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="column" alignItems="flex-end" p={3}>
        <SignTypo style={{ whiteSpace: "pre", marginBottom: 24 }} align="right">
          {"2021년          월          일"}
        </SignTypo>
        <Box position="relative" display="flex" alignItems="flex-end" mb={2}>
          <SignTypo onClick={handleOpen}>동의인:</SignTypo>
          <TextField
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
        <DialogTitle id="simple-dialog-title">서명을 입력해주세요</DialogTitle>
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
  );
};

export default Document;
