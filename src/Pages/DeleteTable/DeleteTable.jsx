import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Collapse, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import {  useFormContext } from 'react-hook-form';

export default function DExtension(props) {
    const { info,index } = props;
    const [open, setOpen] = React.useState(false);
    const { register,setValue,reset } = useFormContext();
	setValue(`partition.${index}.name`,`${info.partition}`)
	setValue(`partition.${index}.uuid`,`${info.uuid}`)
	useEffect(() => {
		reset()}, [reset]);
		
  return (
    <React.Fragment>
    <TableBody key={info.partition} >
												
                                             	<TableRow>
                                                	{info.devices?.length>0?<TableCell>
    
                                                			<IconButton
                                                				aria-label="expand row"
                                                				size="small"
                                                				onClick={()=>setOpen(!open)}
                                                			>
                                                				{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                			</IconButton>
                                                		</TableCell>:<TableCell></TableCell>}
                                                		<TableCell align="left">
                                                			{info.extenion}
                                                		</TableCell>
                                                		<TableCell align="center">
                                                			{info.partition===""?"None":info.partition}
                                                		</TableCell>
                                                		<TableCell align="center">
                                                		<Switch
														
                                                		{...register(`partition.${index}.state`)}
														inputProps={{ 'aria-labelledby': 'Switch A' }}
                                                		/>
                                                		</TableCell>
                                                	</TableRow>
                                                			{info.devices?.length>0?
                                                	<TableRow>
                                                		<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                			<Collapse in={open} timeout="auto" unmountOnExit>
                                                				<Box sx={{ margin: 1 }}>
                                                					<Typography variant="h6" gutterBottom component="div">
                                                						Relations
                                                					</Typography>
                                                					<Table size="small" aria-label="RelationsToExts">
                                                						<TableHead>
                                                							<TableRow>
                                                								<TableCell align="left">Service name</TableCell>
                                                								<TableCell align="right">Service type</TableCell>
                                                								<TableCell align="right">No.Services</TableCell>
                                                								<TableCell>Actions</TableCell>
                                                							</TableRow>
                                                						</TableHead>
                                                						<TableBody>
                                                							{info.devices?.map((device,ind)=>{
                                                                                // setValue(`partition.${index}.devices.${ind}.partition`,`${info.partition}`)
																				// setValue(`devices.${index}.extension`,`${info.extenion}`)
																				setValue(`partition.${index}.devices.${ind}.name`,`${device.device}`)
																				setValue(`partition.${index}.devices.${ind}.type`,`${device.type}`)

                                                							return(
                                                							<TableRow key={device.device+index}>
                                                							<TableCell align="center">{device.device}</TableCell>
                                                							<TableCell align="center">{device.type}</TableCell>
                                                							<TableCell align="center">{ind+1}</TableCell>
                                                							<TableCell align="center">
                                                							<Switch
                                                							{...register(`partition.${index}.devices.${ind}.state`)}
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
