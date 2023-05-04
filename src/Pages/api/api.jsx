import { Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import {ModeEditOutline,DeleteOutline, Visibility, AddCircleOutlineOutlined, Close} from "@mui/icons-material"
import React, { useState } from 'react'
import "./api.css"
import { useSelector } from 'react-redux'
import CustomLoading from '../../components/CustomLoading/CustomLoading'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useCallback } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import { AddUserSuccess } from '../../Redux/AddUser/AddActions'


export default function Les() {
  let params = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action=id=>(
    <> <Close onClick={() => { closeSnackbar(id) }} className='Close TIcon'/> 
    
  </>
)
  const [Loading,setLoading]=useState(false)
  
  const users= useSelector(state=>state.Add);
  // const users=User.data
//   function Senddata(SendData){
// return(SendData.json())
//   };
//   Senddata()
const checkParam=useCallback(()=>{
  // It should be users.users.UserId to match the conditiions but i had to chcange it here so it don't match it as the backEnd doesn't return the full info of the user when matched
  if(users.users.UserInfo?.UserId?.toUpperCase()!==params.UserId?.toUpperCase()){
   console.log("Userid doesn't equal params")
   return true
  }
  else if(users.users.UserInfo?.UserId?.toUpperCase()===params.UserId?.toUpperCase()){
    console.log("Userid equal params")
    setLoading(false)
    return false
  }
else {
  return false
}},[params.UserId, users.users.UserInfo?.UserId])
const dispatch= useDispatch()
const getUser=useCallback(async ()=>{
// setLoading(true)
console.log("getUser is Working")
// const GetUser
if(checkParam()){
  console.log("User is being checked as params.userid!=UserInfo.UserId")
  setLoading(true)
  const getUInfo= await axios.get(`/getUserInfo/${params.UserId}`).then((Res)=>{
    if(Res.data.data){
    console.log(Res.data.data)
    dispatch(AddUserSuccess(Res.data.data))
    setLoading(false)
  }
    else if(Res.data.fault){
      console.log(Res.data.fault)
      setLoading(false)
      enqueueSnackbar(Res.data.fault,{variant: 'error',action}); 
    }
    else if(Res.data.error){
      console.log(Res.data.error)
      setLoading(false)
      enqueueSnackbar(Res.data.error,{variant: 'error',action});    
    }
  }).catch((err)=>{console.log(err)
    enqueueSnackbar(err.message,{variant: 'error',action})
    setLoading(false)})
}
else{setLoading(false)}


},[checkParam])



  console.log(users.users.UserInfo);
console.log("RouterParams",params.UserId)

useEffect(()=>{
  getUser();
  console.log("UseEffect is working")
},[getUser])
 
  // const data=[
  //   {name:"mo",age:21},
    
  //   {name:"sa",age:22}
  // ]
  // const columns=[
  //   {title:"name",field:"name"},
  //   {title:"age",field:"age"}
  // ]

  return (
    <>
    <div className='api'>
      {Loading?<CustomLoading/>:<>
        <div className="topUserInfo">
          <div className="left">
            <div className="editButton">Edit</div>
            <Typography className='title' variant='h6' sx={{mb:1}}>User Inforamtion</Typography>
            <div className="userItems">
            <div className="item">
            <Avatar alt="Remy Sharp"   sx={{ width: 60, height: 60 }}>{users.users.UserInfo?.firstName[0].toUpperCase()+" "+users.users.UserInfo?.lastName[0].toUpperCase()}</Avatar>
              </div>
            <div className="userDetails">
              <Typography className='userName'variant='h7' sx={{mb:10,fz:20}}>{users.users.UserInfo?.firstName?users.users.UserInfo?.firstName:"None"} {users.users.UserInfo?.lastName?users.users.UserInfo?.lastName:"None"}</Typography>
              <div className="detailItem">
                <Typography className='itemKey' variant='span'>Department: </Typography>
                <Typography className='ItemValue' variant='span'>Egypt</Typography>
                </div>
                <div className="detailItem">
                <Typography className='itemKey' variant='span'>User Id: </Typography>
                <Typography className='ItemValue' variant='span'>{users.users.UserInfo?.UserId?users.users.UserInfo?.UserId:"None"}</Typography>
                </div>
                <div className="detailItem">
                <Typography className='itemKey' variant='span'>Email: </Typography>
                <Typography className='ItemValue' variant='span'>{users.users.UserInfo?.mailid?users.users.UserInfo?.mailid:"None"}</Typography>
                </div>
                <div className="detailItem">
                <Typography className='itemKey' variant='span'>Extension: </Typography>
                <Typography className='ItemValue' variant='span'>{users.users.UserInfo?.PrimaryExtension?users.users.UserInfo?.PrimaryExtension:"None"}</Typography>
                </div>
              </div>
            </div></div>
          <div className="right"> 
          
                     <Typography className='title' variant='h6' sx={{mb:1}}>Assets</Typography>
                     <div className="userItemsR">
                     
              <div className="detailItemR">
                <Typography className='itemKey' variant='span'>User status: </Typography>
                <Typography className='ItemValue' variant='span'>Enabled Local</Typography>
                </div> 
                <div className="detailItemR">
                <Typography className='itemKey' variant='span'>Logged in Device: </Typography>
                <Typography className='ItemValue' variant='span'>None</Typography>
                </div> 
                <div className="detailItemR">
                <Typography className='itemKey' variant='span'>CSF status: </Typography>
                <Typography className='ItemValue' variant='span'>unregistred</Typography>
                </div> 
                <div className="detailItemR">
                <Typography className='itemKey' variant='span'>Webex Hub Presence: </Typography>
                <Typography className='ItemValue' variant='span'>Not Added</Typography>
                </div>
                </div>
</div>
          </div>
        <div className="bottom">
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell width="1%" ></TableCell>
            <TableCell>services</TableCell>
            <TableCell width="20px">No. of Services</TableCell>
            <TableCell>Extensions</TableCell>
            <TableCell >Actions</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell > </TableCell>
              <TableCell component="th" scope="row">
                User Device Profile
              </TableCell>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell component="th" scope="row">
              {users.users.UserInfo?.PrimaryExtension}
              </TableCell>
              <TableCell component="th" >
                <div className="TIconsCont">
                  <ModeEditOutline className='ModeEditOutline TIcon'/>
              <DeleteOutline className='DeleteOutline TIcon'/>
              <Visibility className='Visibility TIcon'/>
              </div>
                </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell > </TableCell>
              <TableCell component="th" scope="row">
                User SoftPhone
              </TableCell>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell component="th" scope="row">
              {users.users.UserInfo?.PrimaryExtension}
              </TableCell>
              <TableCell component="th" >
                <div className="TIconsCont">
                  <ModeEditOutline className='ModeEditOutline TIcon'/>
              <DeleteOutline className='DeleteOutline TIcon'/>
              <Visibility className='Visibility TIcon'/>
              </div>
                </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell > </TableCell>
              <TableCell component="th" scope="row">
                User DeskPhone
              </TableCell>
              <TableCell component="th" scope="row">
                0
              </TableCell>
              <TableCell  component="th" scope="row">
              -
              </TableCell>
              <TableCell component="th" >
                <div className="TIconsCont">
                  <AddCircleOutlineOutlined className='AddCircleOutlineOutlined TIcon'/>
              </div>
                </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell > </TableCell>
              <TableCell component="th" scope="row">
                User VoiceMail
              </TableCell>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell component="th" scope="row">
              {users.users.UserInfo?.PrimaryExtension}
              </TableCell>
              <TableCell component="th" >
                <div className="TIconsCont">
                  <ModeEditOutline className='ModeEditOutline TIcon'/>
              <DeleteOutline className='DeleteOutline TIcon'/>
              <Visibility className='Visibility TIcon'/>
              </div>
                </TableCell>
            </TableRow>
            
              
        </TableBody>
      </Table>
    </TableContainer>
          </div></>}
    </div>
    </>)
}
