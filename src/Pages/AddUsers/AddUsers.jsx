import "./AddUsers.css";
import React, {
  useEffect,
  useState,
} from "react";
import { AddUserRequest, AddUserSuccess,AddUserLPartition, AddUserVMTemplates } from "../../Redux/AddUser/AddActions";
import { useSelector,useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Typography,
  Switch,
  Autocomplete,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormGroup,
  CircularProgress,
  Button,
  InputAdornment,
 
} from "@mui/material";
import { useSnackbar } from 'notistack';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { Close } from "@mui/icons-material";

function AddUsers() {
  let options = top100Films.map(
    (option) => {
      let firstLetter =
        option.title[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(
          firstLetter
        )
          ? "0-9"
          : firstLetter,
        ...option,
      };
    }
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
const numOfUsers= useSelector(state=>state.Add.users)
const LPartition=useSelector(state=>state.Add.Partitions)
const VMTemplate=useSelector(state=>state.Add.VMTemplates)
const dispatch= useDispatch()
  const [userData,setUserData]=useState();
  const action=id=>(
    <> <Close onClick={() => { closeSnackbar(id) }} className='Close TIcon'/> 
    
  </>
)
  
  const  checkUser= async(input)=>{
    setLoadingUser(true);
    // console.log(JSON.stringify({"UserId":String(input.target.value)}))
    const data={"UserId":String(input.target.value)}
     const checkUser= await axios.post("/checkUserState",data)
    .then((res) => {
     if( res.data.data){
      console.log(res.data.data)
      setLastName(res.data.data.lastName)
      setValue("lastName",res.data.data.lastName)
      setLoadingUser(false)
    }
        else if(res.data.fault) {console.log(
            res.data.fault
          )
          setValue("lastName","")
          setValue("firstName","")
          setValue("mailid","")
          
          setLoadingUser(false)

          
    }
   

    })
  
    .catch((err) => [
      setUserData(data),
      setLastName(data.lastName),
      setLoadingUser(false),
     
    ], console.log(userData
      )
      
    )
    // .then((Response)=>{(Response.ok)?setUserData(Response.json()):console.log(
    //   Response.status,"Something's Wrong"
    // );}).then(setLoadingUser(false))
    
    
//       .then((userData)=>{
// console.log(userData)      })
    

}

// const preLoadedValues={
//   firstName: userData.firstName,
//   lastName: userData.lastName,
//   email: userData.mailid
// }
  let {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm(
  );
  let navigate = useNavigate();
  const [loading, setLoading] =
    useState(false);
    const [loadingUser, setLoadingUser] =
    useState(false);
    const [VMTValue, setVMTValue] =
    useState("voicemailusertemplate");
    const [LPValue, setLPValue] =
    useState(LPartition[0]);
    const [LastName, setLastName] =
    useState("");
  const [checkedEM, setCheckedEM] =
    useState(false);
    const [CSSvalue, setEMCSS] =
    useState("International");
    const [lang, setLang] =
    useState("English");
    const [langVM, setLangVM] =
    useState("English");
    const [CSSvalueDP, setCSSvalueDP] =
    useState("International");
    const [CSSL1, setCSSL1] =
    useState("International");
    const [checkedCSF, setCheckedCSF] =
    useState(false);
    const [CSSvalueCSF, setCSFCSS] =
    useState("International");
    const [checkedDP, setCheckedDP] =
    useState(false);
    const [checkedVM, setCheckedVM] =
    useState(false);
    const [FwNR, setFwNR] =
    useState("None");
    const [FwB, setFwB] =
    useState("None");
  
    const nav=userid=>{navigate(`/Users/${String(userid)}`)}

  const onSubmit = async (mo) => {
    dispatch(AddUserRequest())
    console.log(mo)
    setLoading(true)
    const response=await axios.post("/AddUser",mo)
      .then((Res) => {
        if (Res.data.status==="success"){
          enqueueSnackbar("User has been created",{variant: 'success',action});
      nav(Res.data.data.UserId)
      }
        if (Res.data.fault){
          enqueueSnackbar(Res.data.fault,{variant: 'error',action});
        }
        // Response.json();
          return(
          // Res=Response.json(),
          dispatch(AddUserSuccess(Res.data.data)),
          //  console.log(response),
           console.log(Res.data),

           setLoading(false)
          //  nav(Response.data.userId)
        )
    })
      .catch((errors) => {
        if (errors) {
          enqueueSnackbar(`frontEnd received error from backEnd: ${errors}`,{variant: 'error',action})
          console.log(errors)
          setLoading(false)
          
        }
      })
    
  };
 const CheckPartition=async()=>{
  // setPLoad(true)
  const response=await axios.get("/CheckPartition").then(res=>{
    if (res.data.data.partitions){
      dispatch(AddUserLPartition(res.data.data.partitions))
      console.log(res.data.data.partitions)
      setValue("LPartition",LPartition[0])
      console.log(LPartition)
    }
    if (res.data.data.VMTemplates){
      dispatch(AddUserVMTemplates(res.data.data.VMTemplates))
      
      console.log(res.data.data.VMTemplates)
      setValue("VMTemplate",VMTemplate[0].label)

      console.log(VMTemplate)
    }
    else if(res.data.fault){

      return (console.log(res.data))
    }
  }
    ).catch(err=>{
      return (console.log(err))
    })
 };
useEffect(() => {
  CheckPartition();
},[]);

  return (
    <div className="AddUsers">
      {loading ? (<><CustomLoading/></>
      ) : (
        <div>
          <div className="top">
            <h1>Add New User</h1>
          </div>
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
          ><FormGroup onSubmit={handleSubmit(
            onSubmit
          )}>
            <div className="mapping">
              <Typography
                variant="h6"
                component="h2"
              >
                Basic User Information
              </Typography>
              <div className="UserInfoCont">
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    id="autoCompLabel"
                    htmlFor="grouped-demo"
                  >
                    Site id:
                  </label>
                  <Autocomplete
                    className="inputField"
                    id="grouped-demo"
                    options={options.sort(
                      (a, b) =>
                        -b.firstLetter.localeCompare(
                          a.firstLetter
                        )
                    )}
                    groupBy={(option) =>
                      option.firstLetter
                    }
                    getOptionLabel={(
                      option
                    ) => option.title}
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    renderInput={(
                      params
                    ) => (
                      <TextField
                        {...params}
                        label="Default"
                        autoComplete="off"
                      />
                    )}
                    autoHighlight
                    variant="outlined"
                  />
                </div>
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    User Id:
                  </label>
                  <TextField
                    {...register(
                      "UserId"
                    )}
                    id="userId"
                    className="inputFieldUserId"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    onBlur={checkUser}
                    // label="User Id"
                    variant="outlined"
                    InputProps={{endAdornment:<InputAdornment position="end">{loadingUser?<CircularProgress size={15} />:<></>}</InputAdornment>}}
                  />
                  {/* {loadingUser ? <CircularProgress />:<></> } */}
                </div>
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    First Name:{" "}
                  </label>
                  <TextField
                    id="firstName"
                    {...register(
                      "firstName"
                    )}
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    // label="First Name"
                    variant="outlined"
                  />
                </div>
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Last Name:{" "}
                  </label>
                  
                  <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value, ref } }) =>(
                  <TextField
                    id="lastName"
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    
                    // onChange={(e)=>{setLastName(value)}}
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    // label="Last Name"
                    variant="outlined"
                  /> )}
                  />
                </div>
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Email:
                  </label>
                  <TextField
                    id="email"
                    {...register(
                      "email"
                    )}
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    // label="Email"
                    variant="outlined"
                  />
                </div>
              </div>
            </div>

            <div className="mapping">
              <Typography
                variant="h6"
                component="h2"
              >
                User Assets
              </Typography>
              <div className="UserInfoCont">
                <FormControlLabel
                className="switchLabelFormStyle"
                  control={
                    <Switch
                    {...register(
                      "checkedEM"
                    )}
                      checked={checkedEM}
                      value={checkedEM}
                      onChange={(event) => setCheckedEM(event.target.checked)}
                      inputProps={{
                        "aria-label":
                          "controlled",
                      }}
                    />
                  }
                  label="Extension Mobility"
                  labelPlacement="start"
                />
                {checkedEM && <div className="EMfeatures">
                     <FormControl variant="outlined" sx={{ m: 1, width: 250 }}>
                     <InputLabel id="demo-simple-select-standard-label-EM">CSS</InputLabel>
                     <Select
                     {...register(
                      "CSSEM"
                    )}
                       labelId="demo-simple-select-standard-label-EM"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={CSSvalue}
                       onChange={(event) => setEMCSS(event.target.value)}
                       label="CSS"
                     >
                       <MenuItem value={"Local"}>Local</MenuItem>
                       <MenuItem value={"National"}>National</MenuItem>
                       <MenuItem value={"International"}>International</MenuItem>
                     </Select></FormControl>
</div>}
                <FormControlLabel
                className="switchLabelFormStyle"
                  control={
                    <Switch
                    {...register(
                      "checkedCSF"
                    )}
                      checked={checkedCSF}
                      value={checkedCSF}
                      onChange={(event) => setCheckedCSF(event.target.checked)}
                      inputProps={{
                        "aria-label":
                          "controlled",
                      }}
                    />
                  }
                  label="User's SoftPhone"
                  labelPlacement="start"
                />
                {checkedCSF && <div className="EMfeatures">
                     <FormControl variant="outlined" sx={{ m: 1, width: 250 }}>
                     <InputLabel id="demo-simple-select-standard-label-CSF">CSS</InputLabel>
                     <Select 
                     {...register(
                      "CSSCSF"
                    )}
                       labelId="demo-simple-select-standard-label-CSF"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={CSSvalueCSF}
                       onChange={(event) =>setCSFCSS(event.target.value)}
                       label="CSS"
                     >
                       <MenuItem value={"Local"}>Local</MenuItem>
                       <MenuItem value={"National"}>National</MenuItem>
                       <MenuItem value={"International"}>International</MenuItem>
                     </Select></FormControl>
                     <FormControl variant="outlined"  sx={{ m: 1, width: 250 }}>
                     <InputLabel id="demo-simple-select-standard-label-CSF">Language</InputLabel>
                     <Select 
                     {...register(
                      "Language"
                    )}
                       labelId="demo-simple-select-standard-label-CSF"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={lang}
                       onChange={(event) =>setLang(event.target.value)}
                       label="Language"
                     >
                       <MenuItem value={"English"}>English</MenuItem>
                       <MenuItem value={"German"}>German</MenuItem>
                       <MenuItem value={"Chinese"}>Chinese</MenuItem>
                     </Select></FormControl>
</div>}
<FormControlLabel
                className="switchLabelFormStyle"
                  control={
                    <Switch
                    {...register(
                      "checkedDP"
                    )}
                      checked={checkedDP}
                      value={checkedDP}
                      onChange={(event) => setCheckedDP(event.target.checked)}
                      inputProps={{
                        "aria-label":
                          "controlled",
                      }}
                    />
                  }
                  label="User's DeskPhone"
                  labelPlacement="start"
                />
                {checkedDP && <div className="EMfeatures">
                     <FormControl variant="outlined" sx={{ m: 1, width: 250 }}>
                     
                     <InputLabel id="demo-simple-select-standard-label">CSS</InputLabel>
                     <Select
                      {...register(
                        "CSSvalueDP"
                      )}
                       labelId="demo-simple-select-standard-label"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={CSSvalueDP}
                       onChange={(event) =>setCSSvalueDP(event.target.value)}
                       label="CSS"
                     >
                      
                       <MenuItem value={"Local"}>Local</MenuItem>
                       <MenuItem value={"National"}>National</MenuItem>
                       <MenuItem value={"International"}>International</MenuItem>
                     </Select></FormControl>
</div>}
                <FormControlLabel
                className="switchLabelFormStyle"
                  control={
                    <Switch
                    {...register("VM")}
                      checked={checkedVM}
                      value={checkedVM}
                      onChange={(event) => setCheckedVM(event.target.checked)}
                      inputProps={{
                        "aria-label":
                          "controlled",
                      }}
                    />
                  }
                  label="User's VoiceMail"
                  labelPlacement="start"
                  
                />
                {checkedVM &&<div className="EMfeatures">
                  <FormControl variant="outlined" notched="true" sx={{ m: 1, width: 250 }}>
                  <InputLabel id="demo-simple-select-standard-label-CSF">Language</InputLabel>
                     <Select
                      notched={true}
                     {...register(
                      "langVM"
                    )}
                       labelId="demo-simple-select-standard-label-CSF"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={langVM}
                       onChange={(event) => setLangVM(event.target.value)}
                       label="Language"
                     >
                       <MenuItem value={"English"}>English</MenuItem>
                       <MenuItem value={"German"}>German</MenuItem>
                       <MenuItem value={"Chinese"}>Chinese</MenuItem>
                     </Select></FormControl>
                     <FormControl variant="outlined" notched="true" sx={{ m: 1, width: 250 }}>
                     {/* <InputLabel id="demo-simple-select-standard-label-CSF">Voice Mail Template</InputLabel> */}
                     {/* <Controller
        control={control}
        name="VMTemplate" */}
        {/* render={({ field: { onChange, onBlur, value, ref } }) =>( */}
                     <Autocomplete
                     notched="true"
                     
                     onChange={(e)=>setValue("VMTemplate",e.target.value)}

                     onSelect={(e)=>{console.log("VMTemplate",e.target.value)}}
                       id="demo-simple-select-standard"
                       options={VMTemplate}
                       getOptionLabel={(option) => option.label}
                       defaultValue={{label:"voicemailusertemplate"}}
                      //  value={value}
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                      // label="Voice Mail Template"
                      // value={VMTValue}
                      // onInputChange={async (e, value) => {
                      //   setVMTValue(value)                      
                      // console.log("=====",value)}}
                      
                      //  isOptionEqualToValue={(option, value) => option.label===value.label}
                      renderInput={(params) => <TextField  {...params}   {...register("VMTemplate")}
                      
                      />}
                       label="Patition"
                       sx={{
                        width: 300,
                        height: 50,
                        mb: 2,
                      }}
                     />
                     {/* )}
                     />
                     */}
                      </FormControl>
                  </div> }
                <div className="ElemCont"></div>
                
              </div>
            </div>
            
            <div className="mapping">
              <Typography
                variant="h6"
                component="h2"
              >
                User Lines
              </Typography><div className="UserInfoCont">
                
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Line 1:
                  </label>
                  <TextField
                    {...register("line1")}
                    id="userId"
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    
                    // label="Line 1"
                    variant="outlined"
                  /></div>
                  <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                    id="autoCompLabel1"
                  >
                    Line partition:
                  </label>
                  {/* <Controller
        control={control}
        
        render={({ field:{ref,onBlur,onChange,value} }) =>( */}
                     <Autocomplete
                    //  {...field}
                    
                    onChange={(e)=>setValue("LPartition",e.target.value)}

                     onSelect={(e)=>{setValue("LPartition",e.target.value)}}
                     options={LPartition}
                      defaultValue={"None"}
                      autoSelect
                      value={LPValue}
                      onInputChange={async (event, value) => {
setLPValue(value)                      }}
                      getOptionLabel={(option) => option}

                       isOptionEqualToValue={(option, value) => option===value}
                      //  value={CSSL1}
                      renderInput={(params) => <TextField {...params}  {...register("LPartition")}
                      // label="Line Partitions" 
                      />}
                      //  onChange={(event) =>setCSSL1(event.target.value)}
                       label="Patition"
                       sx={{
                        width: 300,
                        height: 50,
                        mb: 2,
                      }}
                     />
                     {/* )}
                     /> */}
                      
                    
                </div>
                   <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Line CSS:{" "}
                  </label>
                  <FormControl variant="outlined" sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}>
                     
                     <InputLabel id="demo-simple-select-standard-label">CSS</InputLabel>
                     <Select
                     {...register(
                      "CSSL1"
                    )}
                       labelId="demo-simple-select-standard-label"
                       id="demo-simple-select-standard"
                       defaultValue={"International"}
                       value={CSSL1}
                       onChange={(event) =>setCSSL1(event.target.value)}
                       label="CSS"
                     >
                      
                       <MenuItem value={"Local"}>Local</MenuItem>
                       <MenuItem value={"National"}>National</MenuItem>
                       <MenuItem value={"International"}>International</MenuItem>
                     </Select></FormControl>
                </div>
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Forward in busy:{" "}
                  </label>
                  <FormControl variant="outlined" sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}>
                     
                     <InputLabel id="demo-simple-select-standard-label">Fw B</InputLabel>
                     <Select
                     {...register(
                      "FwB"
                    )}
                       labelId="demo-simple-select-standard-label"
                       id="demo-simple-select-standard"
                       defaultValue={"None"}
                       value={FwB}
                       onChange={(event) =>setFwB(event.target.value)}
                       label="FW B"
                     >
                      
                       <MenuItem value={"VM"}>VoiceMail</MenuItem>
                       <MenuItem value={"Internal"}>Internal Number</MenuItem>
                       <MenuItem value={"None"}>None</MenuItem>
                     </Select></FormControl>
                </div>
                {FwB==="Internal" && <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Destination in Busy:
                  </label>
                  <TextField
                  {...register(
                    "DIB"
                  )}
                    id="Destination-in-No-Reply"
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                  
                    label="Destination In Busy"
                    variant="outlined"
                  /></div>}
                <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Forward in No Reply:{" "}
                  </label>
                  <FormControl variant="outlined" sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}>
                     
                     <InputLabel id="demo-simple-select-standard-label">Fw NR</InputLabel>
                     <Select
                     {...register(
                      "FwNR"
                    )}
                       labelId="demo-simple-select-standard-label"
                       id="demo-simple-select-standard"
                       defaultValue={"None"}
                       value={FwNR}
                       onChange={(event) =>setFwNR(event.target.value)}
                       label="FW NR"
                     >
                      
                       <MenuItem value={"VM"}>VoiceMail</MenuItem>
                       <MenuItem value={"Internal"}>Internal Number</MenuItem>
                       <MenuItem value={"None"}>None</MenuItem>
                     </Select></FormControl>
                </div>
                {FwNR==="Internal" && <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Destination in No Reply:
                  </label>
                  <TextField
                  {...register(
                    "DINR"
                  )}
                    id="Destination-in-No-Reply"
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                  
                    label="Destination In No Reply"
                    variant="outlined"
                  /></div>}
                  <div className="ElemCont">
                  <label
                    className="siteIdLabel"
                    htmlFor="grouped-demo"
                  >
                    Alerting & Display:
                  </label>
                  <TextField
                    {...register("Display")}
                    id="Alerting & Display"
                    className="inputField"
                    sx={{
                      width: 300,
                      height: 50,
                      mb: 2,
                    }}
                    
                    // label="Alerting & Display"
                    variant="outlined"
                  /></div>
                  
                
                </div></div>
                <div className="buttons">
                <Button
								variant="outlined"
                type="Submit"
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
									navigate(`/`)
								}>
								Cancel
							</Button></div>
              </FormGroup>
						
          </form>
          
        </div>
      )}
      {/* <button onClick={()=>dispatch(AddUser())}>Adduser</button> */}
    </div>
  );
}

export default AddUsers
const top100Films = [
  {
    title: "Egypt",
    id: 1994,
  },
  {
    title: "Germany",
    id: 1995,
  },
  {
    title: "United states",
    id: 1996,
  },
  {
    title: "Canada",
    id: 1997,
  },
  {
    title: "China",
    id: 1998,
  },
  {
    title: "Japan",
    id: 1999,
  },
  
];
