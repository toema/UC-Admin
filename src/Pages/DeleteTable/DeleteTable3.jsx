import { KeyboardArrowDown, KeyboardArrowUp, ResetTv } from '@mui/icons-material';
import { Collapse, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form';

export default function DUser(props) {
    const { device,index } = props;
    const [open, setOpen] = React.useState(false);
    const { register,setValue,reset } = useFormContext(undefined);
	setValue(`assets.${index}.name`,`${device.device}`)
	setValue(`assets.${index}.class`,`${device.class}`)
	device.objectId?setValue(`assets.${index}.name`,`${device.objectId}`):setValue(`assets.${index}.name`,`${device.device}`)
	useEffect(()=>{reset()},[reset])
	let DType=""
									if(device.device.slice(0,3)==="BOT"){
										DType="iPhone Soft Phone"
									}
									else if(device.device.slice(0,3)==="CSF"){
										(DType="Desktop Soft Phone")
									}
									else if(device.device.slice(0,3)==="TCT"){
										(DType="Tablet Soft Phone")
									}
									else if(device.device.slice(0,3)==="ANG"){
										(DType="Analog Phone")
									}
									else if(device.device.slice(0,7)==="SEPEEEE"){
										DType="DECT Phone"
									}
									else if(device.device.slice(0,3)==="SEP"){
										DType="Phone device"
									}
									else if(device.device.includes("UDP")|device.class.includes("Device Profile")){
										DType="UDP"
									}else if(device.device.includes("UDP")|device.class.includes("VoiceMail Box")){
										DType="VM"
									}
  return (
    <React.Fragment>
    <TableBody key={device.device} >
												
                                             	<TableRow>
                                                	{device.extensions?.length>0?<TableCell>
    
                                                			<IconButton
                                                				aria-label="expand row"
                                                				size="small"
                                                				onClick={()=>setOpen(!open)}
                                                			>
                                                				{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                			</IconButton>
                                                		</TableCell>:<TableCell></TableCell>}
                                                		<TableCell align="left">
                                                			{device.device}
                                                		</TableCell>
                                                		<TableCell align="center">
														{device.class+" - "+DType+" -"}
                                                		</TableCell>
                                                		<TableCell align="center">
                                                		<Switch
                                                		{...register(`assets.${index}.state`)}
                                                		/>
                                                		</TableCell>
                                                	</TableRow>
                                                			{device.extensions?.length>0?
                                                	<TableRow>
                                                		<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                			<Collapse in={open} timeout="auto" unmountOnExit>
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
                                                							{device.extensions?.map((Ext,ind)=>{
                                                                                setValue(`assets.${index}.extension.${ind}.partition`,`${Ext.partition}`)
                                                                				setValue(`assets.${index}.extension.${ind}.extension`,`${Ext.name}`)
                                                                				setValue(`assets.${index}.extension.${ind}.uuid`,`${Ext.uuid}`)
																				
                                                							return(
                                                							<TableRow key={Ext.uuid+device.device}>
                                                							<TableCell align="center">{Ext.name?Ext.name:"None"}</TableCell>
                                                							<TableCell align="center">{Ext.partition?Ext.partition:"None"}</TableCell>
                                                							<TableCell align="center">{ind+1}</TableCell>
                                                							<TableCell align="center">
                                                							<Switch
                                                							{...register(`assets.${index}.extension.${ind}.state`)}
                                                		/>
                                                							</TableCell></TableRow>)})}
                                                						</TableBody>
                                                					</Table>
                                                				</Box>
                                                			</Collapse>
                                                			</TableCell>
                                                		</TableRow>:<></>}
                                                                        
                                                </TableBody>
    </React.Fragment>
  )
}
