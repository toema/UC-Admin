import React from "react";
import "./FeatureInfo.css";
import { useSnackbar } from 'notistack';
import {
	ArrowRightAltOutlined,
	Close,
	CompareArrowsOutlined,
	EmojiPeopleOutlined,
	HighlightOff,
	KeyboardArrowDown,
	KeyboardArrowUp,
	Person,
	TransferWithinAStationOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
	AddUserRequest,
	AddUserSuccess,
	AddUserFailure,
} from "../../Redux/AddUser/AddActions";
import {
	DeleteUserRequest,
	DeleteUserSuccess,
	DeleteUserFailure,
} from "../../Redux/DeleteUser/DeleteActions";

import {
	Box,
	Button,
	FormControlLabel,
	InputLabel,
	Modal,
	Switch,
	TextField,
	Typography,
	InputAdornment,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Paper,
	IconButton,
	Collapse,
	FormGroup,
	CircularProgress,
	FormControl,
	Select,
	MenuItem,
	Alert,
	AlertTitle,
	Slide,
	Backdrop,
	Grid,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	TransferUserSuccess,
	TransferUserRequest,
	TransferUserFailure,
	TransferToUserSuccess,
} from "../../Redux/TransferUser/TransferAction";
import { useEffect } from "react";
import DExtension from "../../Pages/DeleteTable/DeleteTable";
import DDevice from "../../Pages/DeleteTable/DeleteTable2";
import DUser from "../../Pages/DeleteTable/DeleteTable3";
import CustomLoading from "../CustomLoading/CustomLoading";
import TransferList from "../CustomXfer/CustomXfer";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "45%",
	height: "80%",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	overflow: "scroll",
};

// function UsersAssets(props){
// 	let {
// 		register,
// 		handleSubmit,
// 		watch,
// 		formState: { errors },
// 	} = useForm();
// 	const {device}=props;
// console.log(device)
// const{deviceName,setDeviceName}=useState("");
// setDeviceName(device)
// const[checked,setChecked]=useState(false);
// const dispatch = useDispatch()

// const TransferSubit =  (input) => {
// 	dispatch(TransferUserSuccess(input))
// }
// return(
// 	<React.Fragment>
// 		<FormGroup onChange={handleSubmit(
//         TransferSubit
//       )}>
{
	/* <form
							onChange={handleSubmit(
								TransferSubmit
							  )}> */
}
{
	/* <div className="CusContainer" key={device.device}>
	<div className={`Device`}>
		<FormControlLabel
			className="SwitchDesign12"
			control={
				<Switch
				{...register(device.device)}
				
					
					inputProps={{
						"aria-label":
							"controlled",
					}}
				/>
			}
			label={device.device}
			labelPlacement="start"
		/> */
}
{
	/* {checkedDev1 && (
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
		)} */
}

// 	</div>
// </div>

{
	/* </form> */
}
// </FormGroup>
// </React.Fragment>
// 	)}

export default function FeatureInfo() {
	const [Res, setRes] = useState(false);
	const [open, setOpen] = useState(false);
	const [openA, setOpenA] = useState(false);
	const [openC, setOpenC] = useState(false);
	const [openT, setOpenT] = useState(false);
	const [openN, setOpenN] = useState(true);

	const [DSelect, setDSelect] = useState("");

	const [checkedCus, setCheckedCus] = useState(false);
	const [checkUser, setCheckUser] = useState(false);
	const [UserNF, setUserNF] = useState(false);
	const [LoadingToUser, setLoadingToUser] = useState(false);
	const [LoadingFrom, setLoadingFrom] = useState(false);
	const [loadingD, setLoadingD] = useState(false);
	const [checkedDev2E, setCheckedDev2E] = useState(false);
	const [checkedDev2T, setCheckedDev2T] = useState(false);
	const [CheckToUserInfo, setCheckToUserInfo] = useState(false);
	const [CheckToUser, setCheckToUser] = useState(false);
	const [CheckToUserAsset, setCheckToUserAsset] = useState(false);
	const methods = useForm({ shouldUnregister: true });
	const {
		register,
		handleSubmit,
		watch,
		reset,
		unregister,

		formState: { errors },
	} = methods;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action=id=>(
        <> <Close onClick={() => { closeSnackbar(id) }} className='Close TIcon'/> 
        
      </>
    )
	// console.log(watch("To"))
	const onSubmit = (mo) => {
		fetch("/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			mode: "cors",
			cache: "default",
			body: JSON.stringify(mo),
		}).then((Response) => {
			Response.ok ? Response.json() : console.log(Response.status);
		});
	};
	const DeleteType = (event) => {
		setDSelect(event.target.value);
		console.log(DSelect);
		dispatch(DeleteUserFailure());
		setCheckUser(false);
	};

	const dispatch = useDispatch();
	const Users = useSelector((state) => state.Add);
	const XferUsers = useSelector((state) => state.Transfer);
	const DeleteUsers = useSelector((state) => state.Delete);

	const checkUserInfo = async (input) => {
		reset({ assets: [] });
		dispatch(AddUserRequest());
		dispatch(DeleteUserRequest());
		setCheckedCus(false);
		const data = { UserId: String(input.target.value) };
		const response = await axios
			.post("/checkUserInfo", data)
			.then((Response) => {
				if (Response.data.data.length > 0) {
					return (
						dispatch(AddUserSuccess(Response.data.data)),
						dispatch(DeleteUserSuccess(Response.data.data)),
						dispatch(TransferUserSuccess(Response.data.data)),
						setCheckUser(true),
						console.log(Response.data.data),
						console.log("CheckUser", XferUsers.users)
					);
				} else {
					return (
						setUserNF(true),
						dispatch(AddUserFailure()),
						dispatch(DeleteUserFailure()),
						setCheckUser(false),
						setCheckedCus(false)
					);
				}
			})
			.catch(
				(err) => (
					dispatch(AddUserFailure(err)),
					dispatch(DeleteUserFailure(err)),
					console.log(err)
				)
			);
		console.log(XferUsers.users);
	};
	// //////////////////////////
	const checkTransfer = async (input) => {
		reset({ assets: [] });
		setCheckedCus(false);
		setLoadingFrom(true);
		const data = { UserId: String(input.target.value) };
		const response = await axios
			.post("/checkTransfer", data)
			.then((Response) => {
				if (Response.data.data) {
					return (
						setLoadingFrom(false),
						dispatch(TransferUserSuccess(Response.data.data)),
						setCheckUser(true),
						console.log(Response.data.data),
						console.log("CheckUser", XferUsers.users)
					);
				} else {
					return (
						setLoadingFrom(false),
						setUserNF(true),
						dispatch(AddUserFailure()),
						dispatch(DeleteUserFailure()),
						setCheckUser(false),
						setCheckedCus(false)
					);
				}
			})
			.catch((err) => {
				setLoadingFrom(false);
				dispatch(AddUserFailure(err));
				dispatch(DeleteUserFailure(err));
				console.log(err);
			});
		// console.log(XferUsers.users)
	};
	const checkUserToInfo = async (input) => {
		const data = { UserId: String(input.target.value) };
		setLoadingToUser(true);
		setCheckToUserInfo(false);
		const response = await axios
			.post("/checkTransfer", data)
			.then((Response) => {
				if (Response.data.data) {
					return (
						dispatch(TransferToUserSuccess(Response.data.data)),
						setCheckToUserInfo(false),
						setCheckToUser(false),
						setCheckToUserAsset(false),
						setLoadingToUser(false),
						console.log(Response.data.data),
						console.log("CheckTOUser", XferUsers.users)
					);
				} else if (Response.data.errors) {
					return (
						setCheckToUser(true),
						setLoadingToUser(false),
						setCheckToUserAsset(false)
					);
				}
				if (Response.data.data.length > 0) {
					return setCheckToUserAsset(true);
				}
			})
			.catch((err) => {
				setCheckToUserInfo(true);
				setLoadingToUser(false);
				console.log(err);
			});
		console.log(Users.users);
	};
	const checkDeviceInfo = async (input) => {
		dispatch(DeleteUserRequest());
		setCheckedCus(false);
		const data = { DDevice: String(input.target.value) };
		const response = await axios
			.post("/checkDeviceInfo", data)
			.then((Response) => {
				if (Response.data.data.length!==0) {
					return (

						dispatch(DeleteUserSuccess(Response.data.data)),
						setCheckUser(true),
						console.log("data",Response.data.data)
					);}
				else if (Response.data.fault||Response.data.data.length===0) {
					return (
						setUserNF(true),
						dispatch(DeleteUserFailure("fault",Response.data.fault)),
						enqueueSnackbar("Device info was not found", { variant: "error",action }),
						setCheckUser(false),
						setCheckedCus(false),
						setCheckUser(false),
						console.log(Response.data.fault)
					);
				} 
				
			})
			.catch((err) => (dispatch(DeleteUserFailure(err)), console.log(err)));
		console.log(DeleteUsers.users);
	};
	// useEffect(undefined, [checkDeviceInfo])
	const checkExtensionInfo = async (input) => {
		dispatch(DeleteUserRequest());
		setCheckedCus(false);
		const data = { DExtension: String(input.target.value) };
		const response = await axios
			.post("/checkExtensionInfo", data)
			.then((Response) => {
				if (Response.data.fault) {
					return (
						setUserNF(true),
						dispatch(DeleteUserFailure(Response.data.fault)),
						enqueueSnackbar(Response.data.fault, { variant: "error",action }),

						setCheckUser(false),
						setCheckedCus(false),
						console.log(Response.data.fault)
					);
				} else if (Response.data.data) {
					return (
						dispatch(DeleteUserSuccess(Response.data.data)),
						setCheckUser(true),
						console.log(Response.data.data)
					);
				}
			})
			.catch((err) => (dispatch(DeleteUserFailure(err)), console.log(err)));
		console.log(DeleteUsers.users);
	};

	
	const TransferSubmit = async (input) => {
		dispatch(TransferUserRequest());

		console.log(input);
		const response = await axios
			.post("/TransferAssets", input)
			.then((Response) => {
				if (Response.data.data.status === "success") {
					setCheckUser(true);
					console.log(Response.data.data);
					dispatch(TransferUserSuccess(Response.data.data));
					setOpen(false);
					enqueueSnackbar(Response.data.data.Action, { variant: "success",action });
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(TransferUserFailure(err));
			});

		console.log(XferUsers.users);
	};
	const DeleteSubmit = async (input) => {
		console.log(input);
		setLoadingD(true)
		const response = await axios
			.post("/DeleteAssets", input)
			.then((Response) => {
				return (
					setCheckUser(true), console.log(Response.data),
					// console.log(Response.data.fault)
					setLoadingD(false),
					setOpenT(false),
					enqueueSnackbar(Response.data.data.action, { variant: "success",action })
					// console.log(DeleteUsers.users)
				);
			})
			.catch((err) => {
				console.log(err);
				setLoadingD(false);
				setOpenT(false)


			});
	};

	return (
		
		<div className="Featured">
			
			<nav>
				<Link to="/AddUsers">
					<div className="FeaturedItem">
						<div className="FeaturedWithoutIcon">
							<div className="FeaturedCon">
								<span className="FeaturedTitle">Add New</span>
							</div>
							<div className="FIcon">
								<Person className="PersonIcon" />
							</div>
						</div>
						{/* <Add className='AddIcon'/> */}
					</div>
				</Link>
			</nav>
			<nav>
				<Link to="/TransferUsers">
					<div className="FeaturedItem">
						<div className="FeaturedWithoutIcon">
							<div className="FeaturedCon">
								<span className="FeaturedTitle">Transfer</span>
							</div>
							<div className="PIcon">
								<TransferWithinAStationOutlined className="TransferWithinAStationOutlined" />
							</div>

							{/* <span className='FeaturedSub'>Create User Package </span> */}
						</div>
						{/* <Add className='AddIcon'/> */}
					</div>
				</Link>
			</nav>
			<div className="FeaturedItem" onClick={() => setOpenT(true)}>
				<div className="FeaturedWithoutIcon">
					<div className="FeaturedCon">
						<span className="FeaturedTitle">Terminate Service</span>
					</div>
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
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="Title">
						<Typography
							id="modal-modal-title"
							className="TitleName"
							variant="h6"
							component="h2"
							sx={{ mr: 1 }}
						>
							Transfer Assets
						</Typography>
						<CompareArrowsOutlined className="CompareArrowsOutlined" />
					</div>

					<div className="TransferOps">
						<FormGroup onSubmit={handleSubmit(TransferSubmit)}>
							<form>
								<div className="TransferOp">
									<div className="fromCont">
										<InputLabel className="FieldName">
											{/* {Users.loading?<CircularProgress size={15} sx={{mr:1}}/>:<></>} */}
											From
										</InputLabel>
										<TextField
											{...register("From")}
											sx={{ mb: 1 }}
											id="outlined-basic"
											label="User ID"
											variant="outlined"
											onBlur={(e) => {
												checkTransfer(e);
												unregister("To");
											}}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{LoadingFrom ? (
															<CircularProgress size={15} />
														) : (
															<></>
														)}
													</InputAdornment>
												),
											}}
										/>
									</div>
									<div className="RArrow">
										<ArrowRightAltOutlined
											className="ArrowRightAltOutlined"
											sx={{
												fontSize: 30,
												position: "relative",
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
									<div className="ToCont">
										<InputLabel className="FieldName">
											{/* {LoadingToUser?<CircularProgress size={15} sx={{mr:1}}/>:<></>} */}
											To
										</InputLabel>
										<TextField
											{...register("To")}
											sx={{ mb: 1 }}
											id="outlined-basic"
											label="User ID"
											variant="outlined"
											onBlur={checkUserToInfo}
											error={CheckToUserInfo}
											helperText={
												CheckToUserInfo &&
												"A connection problem with the server"
											}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{LoadingToUser ? (
															<CircularProgress size={15} />
														) : (
															<></>
														)}
													</InputAdornment>
												),
											}}
										/>
										{CheckToUser ? (
											<div className="AddTransferUser">
												<TextField
													{...register("FirstName")}
													sx={{ mb: 1 }}
													id="outlined-basic"
													label="FirstName"
													variant="outlined"
												/>
												<TextField
													{...register("LastName")}
													sx={{ mb: 1 }}
													id="outlined-basic"
													label="LastName"
													variant="outlined"
												/>
												<TextField
													{...register("Mail")}
													sx={{ mb: 1 }}
													id="outlined-basic"
													label="Mail"
													variant="outlined"
												/>
											</div>
										) : (
											<></>
										)}
									</div>
								</div>
								<div className="CustomCon">
									{checkUser ? (
										<FormControlLabel
											className="SwitchDesign12"
											// disabled={}

											control={
												<Switch
													{...register("TransferCustom")}
													checked={checkedCus}
													disabled={Users.loading}
													value={checkedCus}
													onChange={(event) => {
														setCheckedCus(event.target.checked);
													}}
													inputProps={{
														"aria-label": "controlled",
													}}
												/>
											}
											label="Custom Transfer"
											labelPlacement="start"
										/>
									) : UserNF ? (
										<Typography>User assets was not found</Typography>
									) : (
										<></>
									)}

									{checkedCus && (
										<>
											<TransferList ToUser={CheckToUserAsset} />
										</>
									)}

									{checkedCus &&
										XferUsers.users.from.phoneDevices.map((device, index) => {
											return <></>;

											// 	return(<><Grid
											// 		container
											// 		direction="row"
											// 		justifyContent="center"
											// 		alignItems="center"
											// 	>
											// 	<div className="XferTable" key={index}>
											// 		<div className="OldUser">
											// 		{/* <Typography>{device.device}</Typography> */}
											// 		<TransferList deviceFrom={device}  ToUser={CheckToUserAsset} /></div>
											// 		<div className="3"></div>
											// 	</div></Grid>
											// 	</>

											// 	)

											// 		return(	<React.Fragment key={index}>
											// 		<div className="CusContainer" >
											// 		<div className={index+`Device`}>
											// 			<FormControlLabel
											// 				className={"SwitchDesign12"}
											// 				control={
											// 					<Switch
											// 					{...register(device.device)}

											// 						inputProps={{
											// 							"aria-label":
											// 								"controlled",
											// 						}}
											// 					/>
											// 				}
											// 				label={device.device}
											// 				labelPlacement="start"
											// 			/>
											// 	</div>
											// 	 </div>
											// 	</React.Fragment>
											// )
										})}
								</div>
								<Button
									variant="outlined"
									type="Submit"
									className="SubmitButton"
									onSubmit={handleSubmit(TransferSubmit)}
								>
									Submit
								</Button>
								<Button
									variant="outlined"
									className="cancelButton"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
							</form>
						</FormGroup>
					</div>
				</Box>
			</Modal>
			<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1500 }}
        open={loadingD}
      >
        <CustomLoading/>
      </Backdrop>
			<Modal
				open={openT}
				onClose={() => {
					setOpenT(false);
					setCheckUser(false);
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				 
				<Box sx={style}>
					<div className="Title">
						<Typography
							id="modal-modal-title"
							className="TitleName"
							variant="h6"
							component="h2"
							sx={{ mr: 1 }}
						>
							Terminate Assets
						</Typography>
						<CompareArrowsOutlined className="CompareArrowsOutlined" />
					</div>
					<div className="TransferOps">
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit(DeleteSubmit)}>
								<div className="TransferOpTable">
									<div className="deleteSelectCon">
										<Box sx={{ minWidth: 120, mb: 1 }}>
											<FormControl variant="outlined" sx={{ m: 1, width: 150 }}>
												<InputLabel id="demo-simple-select-standard-label-CSF">
													Action Type
												</InputLabel>
												<Select
													{...register("DType")}
													labelId="demo-simple-select-standard-label-CSF"
													id="demo-simple-select-standard"
													defaultValue={""}
													value={DSelect}
													onChange={(e) => DeleteType(e)}
													label="Action Type"
												>
													<MenuItem value={"UserId"}>User ID</MenuItem>
													<MenuItem value={"Extension"}>Extension</MenuItem>
													<MenuItem value={"Device"}>Device</MenuItem>
												</Select>
											</FormControl>
										</Box>
									</div>
									{DSelect === "UserId" && (
										<div>
											<div className="fromContD">
												<InputLabel className="FieldName">
													User relations
												</InputLabel>

												<TextField
													{...register("DUser")}
													sx={{ mb: 1, width: "25ch", alignSelf: "center" }}
													id="outlined-basic"
													label="User ID"
													variant="outlined"
													onBlur={(e) => {
														checkUserInfo(e);
														reset();
													}}
													onChange={() => reset()}
													onChangeCapture={() => reset()}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																{DeleteUsers.loading ? (
																	<CircularProgress size={15} />
																) : (
																	<></>
																)}
															</InputAdornment>
														),
													}}
												/>
											</div>
											{checkUser && (
												<div className="tableCont">
													<TableContainer component={Paper}>
														<Table aria-label="simple-table">
															<TableHead>
																<TableRow>
																	<TableCell></TableCell>

																	<TableCell
																		align="left"
																		sx={{
																			width: "25%",
																		}}
																	>
																		Service Name
																	</TableCell>
																	<TableCell align="center">
																		Service Type
																	</TableCell>
																	<TableCell align="center">Action</TableCell>
																</TableRow>
															</TableHead>
															{checkUser &&
																DeleteUsers.users?.map((device, index) => {
																	return (
																		<DUser
																			key={device.device}
																			device={device}
																			index={index}
																		/>
																	);
																})}
														</Table>
													</TableContainer>
												</div>
											)}
										</div>
									)}
									{DSelect === "Extension" && (
										<div>
											<div className="fromContD">
												<InputLabel className="FieldName">
													Extension relations
												</InputLabel>

												<TextField
													{...register("DExtension")}
													sx={{ mb: 1, width: "25ch", alignSelf: "center" }}
													id="outlined-basic"
													label="Extension number"
													variant="outlined"
													onBlur={(e) => {
														checkExtensionInfo(e);
														reset();
													}}
													onChange={() => reset()}
													onChangeCapture={() => reset()}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																{DeleteUsers.loading ? (
																	<CircularProgress size={15} />
																) : (
																	<></>
																)}
															</InputAdornment>
														),
													}}
												/>
											</div>
											{checkUser && (
												<div className="tableCont">
													<TableContainer component={Paper}>
														<Table aria-label="simple-table">
															<TableHead>
																<TableRow>
																	<TableCell></TableCell>

																	<TableCell
																		align="left"
																		sx={{
																			width: "25%",
																		}}
																	>
																		Service Name
																	</TableCell>
																	<TableCell align="center">
																		Service Type
																	</TableCell>
																	<TableCell align="center">Action</TableCell>
																</TableRow>
															</TableHead>
															{checkUser &&
																DeleteUsers.users?.map((info, index) => {
																	return (
																		<DExtension
																			key={info.partition}
																			info={info}
																			index={index}
																		/>
																	);
																})}
														</Table>
													</TableContainer>
												</div>
											)}
										</div>
									)}
									{DSelect === "Device" && (
										<div>
											<div className="fromContD">
												<InputLabel className="FieldName">
													Device relations
												</InputLabel>

												<TextField
													{...register("DDevice")}
													sx={{ mb: 1, width: "25ch", alignSelf: "center" }}
													id="outlined-basic"
													label="Device name"
													variant="outlined"
													onBlur={(e) => {
														checkDeviceInfo(e);
														reset();
													}}
													onChange={() => reset()}
													onChangeCapture={() => reset()}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																{DeleteUsers.loading ? (
																	<CircularProgress size={15} />
																) : (
																	<></>
																)}
															</InputAdornment>
														),
													}}
												/>
											</div>
											{checkUser && (
												<div className="tableCont">
													<TableContainer component={Paper}>
														<Table aria-label="simple-table">
															<TableHead>
																<TableRow>
																	<TableCell></TableCell>
																	<TableCell
																		align="left"
																		sx={{
																			width: "25%",
																		}}
																	>
																		Service Name
																	</TableCell>
																	<TableCell align="center">
																		Service Type
																	</TableCell>
																	<TableCell align="center">Action</TableCell>
																</TableRow>
															</TableHead>
															{checkUser &&
																DeleteUsers.users?.map((info, index) => {
																	return (
																		<DDevice
																			key={info.device}
																			info={info}
																			index={index}
																		/>
																	);
																})}
														</Table>
													</TableContainer>
												</div>
											)}
										</div>
									)}
								</div>
								<Button
									variant="outlined"
									type="SubmitButton"
									name="Delete"
									className="SubmitButton"
									onSubmit={handleSubmit(DeleteSubmit)}
								>
									Submit
								</Button>
								<Button
									variant="outlined"
									className="cancelButton"
									onClick={() => setOpenT(false)}
								>
									Cancel
								</Button>
							</form>
						</FormProvider>
					</div>
				</Box>
			</Modal>
			</div>
);
}
