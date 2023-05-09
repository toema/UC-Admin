import React from "react";
import "./FeatureInfo.css";
import {
	ArrowRightAltOutlined,
	CompareArrowsOutlined,
	EmojiPeopleOutlined,
	KeyboardArrowDown,
	KeyboardArrowUp,
	Person,
	TransferWithinAStationOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AddUserRequest, AddUserSuccess } from "../../Redux/AddUser/AddActions";
import {
	Box,
	Button,
	FormControlLabel,
	InputLabel,
	Modal,
	Switch,
	TextField,
	Typography,
	ThemeProvider,
	createTheme,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "40%",
	height: "80%",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	overflow:"scroll",
};

export default function FeatureInfo() {
	const [Res, setRes] =
		useState(false);
	const [open, setOpen] =
		useState(false);
    const [openA, setOpenA] =
		useState(false);
    const [openC, setOpenC] =
		useState(false);
	const [openT, setOpenT] =
		useState(false);

	const [checkedCus, setCheckedCus] =
		useState(false);
	const [checkedDev1, setCheckedDev1] =
		useState(false);
	const [checkedDev2, setCheckedDev2] =
		useState(false);
	const [
		checkedDev1T,
		setCheckedDev1T,
	] = useState(false);
	const [
		checkedDev1E,
		setCheckedDev1E,
	] = useState(false);
	const [
		checkedDev2E,
		setCheckedDev2E,
	] = useState(false);
	const [
		checkedDev2T,
		setCheckedDev2T,
	] = useState(false);
	const [
		checkedDev1Ex1,
		setCheckedDev1Ex1,
	] = useState(false);
	const [
		checkedDev2Ex2,
		setCheckedDev2Ex2,
	] = useState(false);

	let {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const onSubmit = (mo) => {
		fetch("/", {
			method: "POST",
			headers: {
				"Content-Type":
					"application/json",
			},
			mode: "cors",
			cache: "default",
			body: JSON.stringify(mo),
		}).then((Response) => {
			Response.ok
				? Response.json()
				: console.log(Response.status);
		});
	};
	const dispatch= useDispatch()
	const Users=useSelector(state=>state)
	
	const checkUserInfo= async input=>{
		dispatch(AddUserRequest())
		const data={"UserId":String(input.target.value)}
		const response= await axios.post("/checkUserInfo",data).then(Response=>{return( dispatch(AddUserSuccess(Response.data.data))
			// ,console.log(Response.data.data)
			)}).catch(err=>{
			console.log(err)
		})
		console.log(Users.users)
	}
	return (
		<div className="Featured">
			<nav>
				<Link to="/AddUsers">
					<div className="FeaturedItem">
						<div className="FeaturedWithoutIcon">
							<span className="FeaturedTitle">
								Add New
							</span>
							<div className="FIcon">
								<Person className="PersonIcon" />
							</div>
						</div>
						{/* <Add className='AddIcon'/> */}
					</div>
				</Link>
			</nav>
			<div
				className="FeaturedItem"
				onClick={() => setOpen(true)}>
				<div className="FeaturedWithoutIcon">
					<span className="FeaturedTitle">
						Transfer
					</span>
					<div className="PIcon">
						<TransferWithinAStationOutlined className="TransferWithinAStationOutlined" />
					</div>

					{/* <span className='FeaturedSub'>Create User Package </span> */}
				</div>
				{/* <Add className='AddIcon'/> */}
			</div>
			<div
				className="FeaturedItem"
				onClick={() => setOpenT(true)}>
				<div className="FeaturedWithoutIcon">
					<span className="FeaturedTitle">
						Terminate Service
					</span>
					<div className="DIcon">
						<EmojiPeopleOutlined className="EmojiPeopleOutlined" />
					</div>
				</div>
				{/* <Add className='AddIcon' /> */}
			</div>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={style}>
					<div className="Title">
						<Typography
							id="modal-modal-title"
							className="TitleName"
							variant="h6"
							component="h2"
							sx={{ mr: 1 }}>
							Transfer Assets
						</Typography>
						<CompareArrowsOutlined className="CompareArrowsOutlined" />
					</div>

					<div className="TransferOps">
						<form
							onSubmit={handleSubmit(
								onSubmit
							)}>
							<div className="TransferOp">
								<div className="fromCont">
									<InputLabel className="FieldName">
										From
									</InputLabel>
									<TextField
										id="outlined-basic"
										label="User ID"
										variant="outlined"
										onBlur={checkUserInfo}
									/>
								</div>
								<div className="RArrow">
									<ArrowRightAltOutlined
										className="ArrowRightAltOutlined"
										sx={{
											fontSize: 30,
											position:
												"relative",
											top: "11px",
										}}
									/>
									<ArrowRightAltOutlined
										className="ArrowRightAltOutlined"
										sx={{
											fontSize: 30,
										}}
									/>
								</div>
								<div className="fromCont">
									<InputLabel className="FieldName">
										To
									</InputLabel>
									<TextField
										id="outlined-basic"
										label="User ID"
										variant="outlined"
									/>
								</div>
							</div>
							<div className="CustomCon">
								<FormControlLabel
									className="SwitchDesign12"
									control={
										<Switch
											checked={
												checkedCus
											}
											value={checkedCus}
											onChange={(
												event
											) =>
												setCheckedCus(
													event.target
														.checked
												)
											}
											inputProps={{
												"aria-label":
													"controlled",
											}}
										/>
									}
									label="Custom Transfer"
									labelPlacement="start"
								/>
								{checkedCus && (
									<div className="CusContainer">
										<div className="Device1">
											<FormControlLabel
												className="SwitchDesign12"
												control={
													<Switch
														checked={
															checkedDev1
														}
														value={
															checkedDev1
														}
														onChange={(
															event
														) =>
															setCheckedDev1(
																event
																	.target
																	.checked
															)
														}
														inputProps={{
															"aria-label":
																"controlled",
														}}
													/>
												}
												label={` -UDP-`}
												// ${Users.users[0]["device"]}
												labelPlacement="start"
											/>
											{checkedDev1 && (
												<div className="device1Exts">
													<FormControlLabel
														className="SwitchDesign12"
														control={
															<Switch
																checked={
																	checkedDev1Ex1
																}
																value={
																	checkedDev1Ex1
																}
																onChange={(
																	event
																) =>
																	setCheckedDev1Ex1(
																		event
																			.target
																			.checked
																	)
																}
																inputProps={{
																	"aria-label":
																		"controlled",
																}}
															/>
														}
														label={`Extension - -`}
														// ${Users.users[0]["extensions"]}
														labelPlacement="start"
													/>
												</div>
											)}
										</div>

										<div className="Device2">
											<FormControlLabel
												className="SwitchDesign12"
												control={
													<Switch
														checked={
															checkedDev2
														}
														value={
															checkedDev2
														}
														onChange={(
															event
														) =>
															setCheckedDev2(
																event
																	.target
																	.checked
															)
														}
														inputProps={{
															"aria-label":
																"controlled",
														}}
													/>
												}
												label="Device 2 -CSF-"
												labelPlacement="start"
											/>
										</div>
										{checkedDev2 && (
											<div className="device1Exts">
												<FormControlLabel
													className="SwitchDesign12"
													control={
														<Switch
															checked={
																checkedDev2Ex2
															}
															value={
																checkedDev2Ex2
															}
															onChange={(
																event
															) =>
																setCheckedDev2Ex2(
																	event
																		.target
																		.checked
																)
															}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
														/>
													}
													label="Extension -11123-"
													labelPlacement="start"
												/>
											</div>
										)}
									</div>
								)}
							</div>
							<Button
								variant="outlined"
								className="SubmitButton"
								onSubmit={handleSubmit(
									onSubmit
								)}>
								Submit
							</Button>
							<Button
								variant="outlined"
								className="cancelButton"
								onClick={() =>
									setOpen(false)
								}>
								Cancel
							</Button>
						</form>
					</div>
				</Box>
			</Modal>
			<Modal
				open={openT}
				onClose={() => setOpenT(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={style}>
					<div className="Title">
						<Typography
							id="modal-modal-title"
							className="TitleName"
							variant="h6"
							component="h2"
							sx={{ mr: 1 }}>
							Terminate Assets
						</Typography>
						<CompareArrowsOutlined className="CompareArrowsOutlined" />
					</div>

					<div className="TransferOps">
						<form
							onSubmit={handleSubmit(
								onSubmit
							)}>
							<div className="TransferOpTable">
								<div className="fromCont">
									<InputLabel className="FieldName">
										From
									</InputLabel>
									<TextField
									onBlur={()=>setRes(true)}
										id="outlined-basic"
										label="User ID"
										variant="outlined"
									/>
								</div>
								{Res && <div className="tableCont">
									<TableContainer
										component={Paper}>
										<Table aria-label="simple-table">
											<TableHead>
												<TableRow>
                          <TableCell>
                            
                          </TableCell>
                
													<TableCell
														align="left"
														sx={{
															width:
																"30%",
														}}>
														Service Name
													</TableCell>
													<TableCell align="center">
														Service Type
													</TableCell>
													<TableCell align="center">
														Action
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
                        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenA(!openA)}
          >
            {openA ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
													<TableCell align="left">
														Toema1
													</TableCell>
													<TableCell align="center">
														UDP
													</TableCell>
													<TableCell align="center">
														<Switch
															checked={
																checkedDev1T
															}
															value={
																checkedDev1T
															}
															onChange={(
																event
															) =>
																setCheckedDev1T(
																	event
																		.target
																		.checked
																)
															}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openA} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Relations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Service name</TableCell>
                    <TableCell align="right">Service type</TableCell>
                    <TableCell align="right">No.Services</TableCell>
					<TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                <TableCell align="left">11123</TableCell>
				<TableCell align="right">Extension</TableCell>
                    <TableCell align="right">1</TableCell>
					<TableCell align="center">
														<Switch
															checked={
																checkedDev1E
															}
															value={
																checkedDev1E
															}
															onChange={(
																event
															) =>
																setCheckedDev1E(
																	event
																		.target
																		.checked
																)
															}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
														/>
													</TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
												<TableRow>
                        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenC(!openC)}
          >
            {openC ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
													<TableCell align="left">
														CSFToema1
													</TableCell>
													<TableCell align="center">
														CSF
													</TableCell>
													<TableCell align="center">
														<Switch
															checked={
																checkedDev2T
															}
															value={
																checkedDev2T
															}
															onChange={(
																event
															) =>
																setCheckedDev2T(
																	event
																		.target
																		.checked
																)
															}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openC} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Relations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Service name</TableCell>
                    <TableCell align="right">Service type</TableCell>
                    <TableCell align="right">No.Services</TableCell>
					<TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                <TableCell align="left">11123</TableCell>
				<TableCell align="right">Extension</TableCell>
                    <TableCell align="right">1</TableCell>
					<TableCell align="center">
														<Switch
															checked={
																checkedDev2E
															}
															value={
																checkedDev2E
															}
															onChange={(
																event
															) =>
																setCheckedDev2E(
																	event
																		.target
																		.checked
																)
															}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
														/>
													</TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</div>}
							</div>
							<Button
								variant="outlined"
								className="SubmitButton"
								sx={{mt:1,}}
								onSubmit={handleSubmit(
									onSubmit
								)}>
								Submit
							</Button>
							<Button
								variant="outlined"
								className="cancelButton"
								onClick={() =>
									setOpenT(false)
								}>
								Cancel
							</Button>
						</form>
					</div>
				</Box>
			</Modal>
		</div>
	);
}
