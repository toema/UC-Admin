import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Collapse, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import {  useFormContext } from 'react-hook-form';

export default function DDevice(props) {
    const { info,index } = props;
    const [open, setOpen] = React.useState(false);
    const { register,setValue,reset } = useFormContext();
	setValue(`devices.${index}.name`,`${info.device}`)
	setValue(`devices.${index}.type`,`${info.class}`)
	useEffect(()=>{reset()},[reset])
	const SValue=false
  return (
    <React.Fragment>
    <TableBody key={info.device} >
												
                                             	<TableRow>
                                                	{info.lines?.length>0?<TableCell>
    
                                                			<IconButton
                                                				aria-label="expand row"
                                                				size="small"
                                                				onClick={()=>setOpen(!open)}
                                                			>
                                                				{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                			</IconButton>
                                                		</TableCell>:<TableCell></TableCell>}
                                                		<TableCell align="left">
                                                			{info.device}
                                                		</TableCell>
                                                		<TableCell align="center">
                                                			{info.class}
                                                		</TableCell>
                                                		<TableCell align="center">
                                                		<Switch
                                                		{...register(`devices.${index}.state`)}
                                                		/>
                                                		</TableCell>
                                                	</TableRow>
                                                			{info.lines?.length>0?
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
                                                							{info.lines?.map((line,ind)=>{
                                                                				setValue(`devices.${index}.extension.${ind}.partition`,`${line.partition}`)
                                                                				setValue(`devices.${index}.extension.${ind}.extension`,`${line.extension}`)
                                                                				setValue(`devices.${index}.extension.${ind}.uuid`,`${line.uuid}`)

                                                							return(
                                                							<TableRow key={line.extension+ind+index}>
                                                							<TableCell align="center">{line.extension}</TableCell>
                                                							<TableCell align="center">{line.partition===null?"None":line.partition}</TableCell>
                                                							<TableCell align="center">{ind+1}</TableCell>
                                                							<TableCell align="center">
                                                							<Switch
                                                							{...register(`devices.${index}.extension.${ind}.state`)}
																			defaultValue={SValue}
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
