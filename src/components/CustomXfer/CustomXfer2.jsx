import React, { Component } from "react";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import "./CustomXfer.css"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CustomList from './CustomList/CustomList';
import { render } from "react-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { TransferToUserSuccess, TransferUserSuccess } from "../../Redux/TransferUser/TransferAction";
import { useFormContext } from "react-hook-form";
import { useCallback } from "react";




export default function TransferList(props) {
    // const{ ToUser}=props
    // console.log("ToUser",ToUser)
    const { setValue,reset,watch } = useFormContext();
    const XferUsers= useSelector(state=>state.Transfer.users) 
    // const XferUsersFrom= useSelector(state=>state.Transfer.users.from) 
    // const XferUsersTo= useSelector(state=>state.Transfer.users.to) 
    // const dispatch=useDispatch()
  // const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(XferUsers.total.user1);
  const [right, setRight] = React.useState(XferUsers.total.user2);
  const [All, setAll] = React.useState(XferUsers.total);
  setValue("XferUsers",All)
  // console.log("XferUsers",All)
  // console.log("left.phoneDevices.at(0)",left.phoneDevices[0].device)
//   useEffect(()=>{
// setLeft(
// setRight()
// console.log("Right",right)
//   },[])

  

  

//   const customList = (items) => (
//     <Paper sx={{ width: 200, height: 60+items.lenght*60, overflow: 'auto' }}>
//       <List dense component="div" role="list">
//         {items?.map((value) => {
//           const labelId = `transfer-list-item-${value.uuid}-label`;
//           return (
//             <ListItem
//               key={value.uuid}
//               role="listitem"
//               button
//             >
//               <ListItemIcon>
//                 <DragIndicator
//                   inputProps={{
//                     'aria-labelledby': labelId,
//                   }}
//                 />
//               </ListItemIcon>
//               <ListItemText id={labelId} primary={`${value.name} - ${value.partition?value.partition:"None"}`} />
//             </ListItem>
//           );
//         })}
//         <ListItem />
//       </List>
//     </Paper>
//   );

// const longest=(left,right,type)=>{
//   switch(type){
//    case "phoneDevices":
//     console.log("left",left)
//     return(left.phoneDevices?.length>right.phoneDevices?.length? left.phoneDevices?.length:right.phoneDevices?.length)
//     case "VM":
//     return(left.VM?.length>right.VM?.length? left.VM?.length:right.VM?.length)
//     case "deviceProfiles":
//     return(left.deviceProfiles?.length>right.deviceProfiles?.length? left.deviceProfiles?.length:right.deviceProfiles?.length)
//     default:
//       return;
//   }
// }
const grid=5;
const getListStyle = (isDraggingOver) => {
  // console.log("provid",provide)
  return({
  background: isDraggingOver ? 'lightblue' : 'none',
  padding: grid,
  width: "40%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  
}
)};
const onDragStart=(res)=>{
  // console.log("onDragStart",res)
}

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
   // <Grid container' spacing={2} justifyContent="space-evenly" alignItems="center">
  userSelect: 'none',
  width: "fit-content",

  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'none',

  // styles we need to apply on draggables
...draggableStyle,
// position:isDragging? "relative":"relative",
  // top:isDragging?"3px":"auto",
  // left:isDragging?"3px":"auto",
});

const reorder = (oldList,newList, startIndex, endIndex,type) => {
  if (type==="droppableItem"){
const result=All
  let begin=getList(result,oldList,type)
  const [removed] = begin.mainDes[begin.last].splice(startIndex,1)
  let end = getList(result,newList,type)
  // console.log("end",end,"removed",removed)
  end.mainDes[end.last]===undefined || end.mainDes[end.last]?.length===0?end.mainDes[end.last]=[removed]:end.mainDes[end.last].splice(endIndex, 0, removed)
  return result;}
  else if(type==="droppableSubItem"){
    const result=All
    let begin=getList(result,oldList,type)
    const [removed] = begin.splice(startIndex,1)
    let end = getList(result,newList,type)
    end===undefined || end?.length===0?end.push(removed):end.splice(endIndex, 0, removed)  
    return result;
  }

};

const getList = (main,id,type) => {
  let listName=[]
  switch(type){
  case "droppableItem":
   listName=id.split("-")
  return {mainDes:main[listName[0]],last:[listName[1]]}
  case "droppableSubItem":
     listName=id.split("-")
  return main[listName[0]][listName[1]][listName[2]][listName[3]]
   default:
    return;
  }
};
// ##Main function for Dragging
function onDragEnd(result) {
// console.log(result)
  const { source, destination } = result;
  // dropped outside the list
  if (!destination) {
    return;
}
else{
  const sourceIndex = source.index;
  const destIndex = destination.index;
      setAll(reorder(source.droppableId,destination.droppableId, sourceIndex, destIndex,result.type))
      setLeft(All.user1)
      setRight(All.user2)
      setValue("XferUsers",All)
      // console.log("All",All)
}
  }

const onDragUpdate=useCallback((res)=>{
  // console.log("onDragUpdate",res)
},[])
// useEffect(()=>{onDragUpdate()},[onDragUpdate])

// sx={{width:"100%",marginBottom:1, height:50+110*longest(left,right,"phoneDevices")}
  return (<>
   <Grid container >
   {(left.phoneDevices||right.phoneDevices) &&<Paper  sx={{width:"60%", position: "relative",left: "15%",marginBottom:1}}
>
      <Typography variant='h6' sx={{fontWeight:"bold",color:"gray",m:"8px 0 0 8px"}}>Phone Devices</Typography>
      <DragDropContext onDragStart={onDragStart}  onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
    <div className="AssetCont">
    <Droppable droppableId="user1-phoneDevices" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      // {...provided.placeholder}
      // {...provided}
      style={getListStyle(snapshot.isDraggingOver,provided)}>
        
        {All.user1.phoneDevices?.map((info,index)=>{
          return(
            <>
            <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}
          // key={index}
          >
            <Typography >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user1-phoneDevices"} info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
</div>
              )}
              </Draggable>
            </>
          )
        })}
          {provided.placeholder}
      </div>
    )}
    
      </Droppable>
      <Droppable droppableId="user2-phoneDevices" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}
      >
        
        {All.user2.phoneDevices?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}>
            <Typography key={index}   >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user2-phoneDevices"} info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
</div>
              )}
              </Draggable>
            </>
          )
        })}
            {provided.placeholder}

      </div>
    )}
    
      </Droppable>
      </div>
      </DragDropContext>
      </Paper>}
      {(left.VM||right.VM) &&<Paper  sx={{width:"60%", position: "relative",left: "15%",marginBottom:1}}
>
      <Typography variant='h6' sx={{fontWeight:"bold",color:"gray",m:"8px 0 0 8px"}}>User voiceMail</Typography>
      <DragDropContext onDragStart={onDragStart}  onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
    <div className="AssetCont">
    <Droppable droppableId="user1-VM" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      // {provided.placeholder}
      // {...provided}
      style={getListStyle(snapshot.isDraggingOver,provided)}>
        
        {All.user1.VM?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}
          // key={index}
          >
            <Typography >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user1-VM"} info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
            </div>
              )}
              </Draggable>
            </>
          )
        })}
      {provided.placeholder}
      </div>
    )}
    
      </Droppable>
      <Droppable droppableId="user2-VM" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}>
        
        {All.user2.VM?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}>
            <Typography key={index}   >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user2-VM"} info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
            </div>
              )}
              </Draggable>
            </>
          )
        })}
      {provided.placeholder}
      </div>
    )}
    
      </Droppable>
      </div>
      </DragDropContext>
      </Paper>}
      {(left.deviceProfiles||right.deviceProfiles) &&<Paper  sx={{width:"60%", position: "relative",left: "15%",marginBottom:1}}
>
      <Typography variant='h6' sx={{fontWeight:"bold",color:"gray",m:"8px 0 0 8px"}}>User profile</Typography>
      <DragDropContext onDragStart={onDragStart}  onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
    <div className="AssetCont">
    <Droppable droppableId="user1-deviceProfiles" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      // {...provided.placeholder}
      // {...provided}
      style={getListStyle(snapshot.isDraggingOver,provided)}>
        
        {All.user1.deviceProfiles?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}
          // key={index}
          >
            <Typography >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user1-deviceProfiles"}info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
            </div>
              )}
              </Draggable>
            </>
          )
        })}
      {provided.placeholder}
      </div>
    )}
    
      </Droppable>
      <Droppable droppableId="user2-deviceProfiles" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}>
        
        {All.user2.deviceProfiles?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid+index+info.device}
                                    draggableId={info.uuid+index}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}>
            <Typography key={index}   >{info.device}</Typography>
            <Grid item ><CustomList index={index} parent={"user2-deviceProfiles"} info={info.device} items={info.extensions}/></Grid>
            {provided.placeholder}
            </div>
              )}
              </Draggable>
            </>
          )
        })}
      {provided.placeholder}
      </div>
    )}
    
      </Droppable>
      </div>
      </DragDropContext>
      </Paper>}
      </Grid>
      </>
  );
}
