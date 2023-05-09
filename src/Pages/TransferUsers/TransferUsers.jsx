import { ArrowRightAltOutlined, Close, CompareArrowsOutlined, DeleteOutline } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, FormControlLabel, FormGroup, Grid, InputAdornment, InputLabel, Switch, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react'
import { useState } from 'react';
import { useForm ,FormProvider} from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CustomLoading from '../../components/CustomLoading/CustomLoading';
import TransferList from '../../components/CustomXfer/CustomXfer2';
import { AddUserFailure } from '../../Redux/AddUser/AddActions';
import { DeleteUserFailure } from '../../Redux/DeleteUser/DeleteActions';
import { TransferToUserSuccess, TransferUserFailure, TransferUserRequest, TransferUserSuccess } from '../../Redux/TransferUser/TransferAction';
import "./TransferUsers.css"
import axiosClient from '../../Axios-client';

export default function TransferUsers() {
    const [checkedCus, setCheckedCus] =
		useState(false);
	const [checkUser, setCheckUser] =
		useState(false);
	const [UserNF, setUserNF] =
		useState(false);
		const [LoadingToUser, setLoadingToUser] =useState(false);
        const [
            LoadingFrom,
            setLoadingFrom,
        ] = useState(false);
        const [
            CheckToUser,
            setCheckToUser,
        ] = useState(false);
        const [
            CheckToUserInfo,
            setCheckToUserInfo,
        ] = useState(false);
       
        const [
            CheckToUserAsset,
            setCheckToUserAsset,
        ] = useState(false);
        const [
            CheckUserAsset,
            setCheckUserAsset,
        ] = useState(false);

    const methods = useForm({shouldUnregister:true});
	const {
		register,
		handleSubmit,
		reset,
		unregister,
		
		formState: { errors },
	} = methods;
    const dispatch = useDispatch()
	const XferUsers= useSelector(state=>state.Transfer)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action=id=>(
        <> <Close onClick={() => { closeSnackbar(id) }} className='Close TIcon'/> 
        
      </>
    )


    const checkTransfer = async input => {
		reset({assets:[]})
		setCheckedCus(false)
		setLoadingFrom(true)
        setCheckUserAsset(true)
		const data = { "UserId": String(input.target.value) }
		const response = await axiosClient.post("/checkTransfer", data).then(Response => {
			if (Response.data.data){
			return (  setCheckUserAsset(false)
            ,setLoadingFrom(false),dispatch(TransferUserSuccess(Response.data.data))
				, setCheckUser(true),console.log(Response.data.data),console.log("CheckUser",XferUsers.users)
			)
		}
			else{
				return(setCheckUserAsset(false),setLoadingFrom(false),setUserNF(true),dispatch(AddUserFailure()),setCheckUser(false),setCheckedCus(false))
			}
		})
		.catch(err => {
            setCheckUserAsset(false)
			setLoadingFrom(false)
			dispatch(AddUserFailure(err))
			console.log(err)
	})
		// console.log(XferUsers.users)
		
	}
	const checkUserToInfo = async input => {
		const data = { "UserId": String(input.target.value) }
		setLoadingToUser(true)
		setCheckToUserInfo(false)
        setCheckedCus(false)
        setCheckToUserAsset(true)
		const response = await axiosClient.post("/checkTransfer", data).then(Response => {
            
			if (Response.data.data){
				
			return (dispatch(TransferToUserSuccess(Response.data.data)),setCheckUser(true),setCheckToUserInfo(false),setCheckToUser(false)
            ,setCheckToUserAsset(false)
            ,setLoadingToUser(false)
				,console.log(Response.data.data),console.log("CheckTOUser",XferUsers.users)

			)
		}
			else if(Response.data.errors){
				return(setCheckToUser(true),setLoadingToUser(false)
                ,setCheckToUserAsset(false)
                )
			}
			// if(Response.data.data.length>0){
				
			// 	return(setCheckToUserAsset(true))
			// }
		})
		.catch(err => {
			setCheckToUserInfo(true)
			setLoadingToUser(false)
			console.log(err)
		})
	}
    const TransferSubmit = async input => {
		
		dispatch(TransferUserRequest())

		console.log("input",input);
		const response = await axiosClient.post("/TransferUserAssets", input).then(Response => {
			if (Response.data.status==="success"){
				setCheckUser(true);
				enqueueSnackbar(Response.data.data,{variant: 'success',action});
				console.log(Response.data.data);
				dispatch(TransferUserSuccess(Response.data.data));

			}
			else if(Response.data.error){
                console.log(Response.data)
                console.log("XferUsers.error",XferUsers.error)

                dispatch(TransferUserFailure(Response.data.error))
                    Response.data.error.forEach(element => {
                    return(enqueueSnackbar(element,{variant: 'error',action}))
                }) 
                
            }
		}).catch(err => {
            
			console.log(err)
			dispatch(TransferUserFailure(err))
		})
		
		
		// console.log(XferUsers.users)
	}
  return (
    
    <div className='TransferMainComponant'>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1500 }}
        open={XferUsers.loading}
      >
        <CustomLoading/>
      </Backdrop>
        <Box >
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
    <FormProvider {...methods} >
    <FormGroup onSubmit={handleSubmit(
TransferSubmit
)}>
        <form
            >
            
            <div className="TransferOp">
                <div className="fromCont">
                    
                    <InputLabel className="FieldName">
                    {/* {Users.loading?<CircularProgress size={15} sx={{mr:1}}/>:<></>} */}
                        From
                    </InputLabel>
                    <TextField
                    {...register("From")}
                    sx={{mb:1}}
                        id="outlined-basic"
                        label="User ID"
                        variant="outlined"
                        onBlur={(e)=>{checkTransfer(e);unregister("To")}}
                        InputProps={{endAdornment:<InputAdornment position="end">{LoadingFrom?<CircularProgress size={15} />:<></>}</InputAdornment>}}
                        
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
                <div className="ToCont">
                    <InputLabel className="FieldName">
                    {/* {LoadingToUser?<CircularProgress size={15} sx={{mr:1}}/>:<></>} */}
                        To
                    </InputLabel>
                    <TextField
                        {...register("To")}
                        sx={{mb:1}}
                        id="outlined-basic"
                        label="User ID"
                        variant="outlined"
                        onBlur={checkUserToInfo}
                        error={CheckToUserInfo}
                        helperText={CheckToUserInfo && "A connection problem with the server"}
                        InputProps={{endAdornment:<InputAdornment position="end">{LoadingToUser?<CircularProgress size={15} />:<></>}</InputAdornment>}}
                    />
                    {CheckToUser?
                        <div className="AddTransferUser">
                        <TextField
                        {...register("FirstName")}
                        sx={{mb:1}}
                        id="outlined-basic"
                        label="FirstName"
                        variant="outlined"
                    />
                    <TextField
                        {...register("LastName")}
                        sx={{mb:1}}
                        id="outlined-basic"
                        label="LastName"
                        variant="outlined"
                    />
                    <TextField
                        {...register("Mail")}
                        sx={{mb:1}}
                        id="outlined-basic"
                        label="Mail"
                        variant="outlined"
                    /></div>:<></>}
                
                </div>
            </div>
            <div className="CustomCon">
                {checkUser?(
                <FormControlLabel
                    className="SwitchDesign12"
                    // disabled={}
                    
                    control={
                        <Switch
                        {...register("TransferCustom")}
                            checked={
                                checkedCus
                            }
                            disabled={CheckUserAsset || CheckToUserAsset}
                            value={checkedCus===undefined?false:checkedCus}
                            onChange={(event) =>{setCheckedCus(event.target.checked)}}
                            inputProps={{
                                "aria-label":
                                    "controlled",
                            }}
                        />
                    }
                    label="Custom Transfer"
                    labelPlacement="start"
                />):(UserNF?<Typography>User assets was not found</Typography>:<></>)}
                
                
                {
                checkedCus && <><TransferList   />
                
                
        </>}
                
                 {/* {checkedCus && 
                XferUsers.users.from.phoneDevices.map((device,index)=>{

                    
                		return(	<React.Fragment key={index}>
                		<div className="CusContainer" >
                		<div className={index+`Device`}>
                			<FormControlLabel
                				className={"SwitchDesign12"}
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
                			/>
                	</div>
                	 </div>
                	</React.Fragment>
                )
})
}  */}
                



                
            </div>
            <Button
                variant="outlined"
                type="Submit"
                className="SubmitButton"
                onSubmit={handleSubmit(
                    TransferSubmit
                )}
                >
                Submit
            </Button>
            <Button
                variant="outlined"
                className="cancelButton"
                onClick={() =>
                     Navigate(-1)
                }>
                Back
            </Button>
        </form>
        </FormGroup></FormProvider>
    </div>
</Box></div>
  )
}
