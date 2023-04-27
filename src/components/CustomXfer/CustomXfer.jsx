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




export default function TransferList(props) {
    // const{ ToUser}=props
    // console.log("ToUser",ToUser)
    const XferUsers= useSelector(state=>state.Transfer.users) 
    const XferUsersFrom= useSelector(state=>state.Transfer.users.from) 
    const XferUsersTo= useSelector(state=>state.Transfer.users.to) 
    const dispatch=useDispatch()
  // const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(XferUsers.from);
  const [right, setRight] = React.useState(XferUsers.to);

  // console.log("left.phoneDevices.at(0)",left.phoneDevices[0].device)
//   useEffect(()=>{
// setLeft(
// setRight()
// console.log("Right",right)
//   },[])

  

  

  const customList = (items) => (
    <Paper sx={{ width: 200, height: 60+items.lenght*60, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items?.map((value) => {
          const labelId = `transfer-list-item-${value.uuid}-label`;
          return (
           
            <ListItem
              key={value.uuid}
              role="listitem"
              button
            >
              <ListItemIcon>
                <DragIndicator
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name} - ${value.partition?value.partition:"None"}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );
const longest=(left,right,type)=>{
  switch(type){
   case "phoneDevices":
    return(left.phoneDevices?.length>right.phoneDevices?.length? left.phoneDevices?.length:right.phoneDevices?.length)
    case "VM":
    return(left.VM?.length>right.VM?.length? left.VM?.length:right.VM?.length)
    default:
      return;
  }
}
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
  console.log("onDragStart",res)
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
// const reorder = (oldList,newList, startIndex, endIndex) => {
//   const begin=getList(oldList)
//   console.log("begin",begin)
//   const [removed] = begin.origin.splice(startIndex, 1);
//   const updatedValueOld={}
//   updatedValueOld[begin.type]=begin.origin
//   begin.direction==="from"?setLeft(assets=>({...assets,...updatedValueOld})):setRight(assets=>({...assets,...updatedValueOld}))

//   const result = getList(newList)
//   console.log("result New",result)

  
//   result.origin.splice(endIndex, 0, removed);
  
//   // const newListKey=new String(newList[1][1])
//   const updatedValueNew={}
//   updatedValueNew[result.type]=result.origin  
//   result.direction==="from"?setLeft(assets=>({...assets,...updatedValueNew})):setRight(assets=>({...assets,...updatedValueNew}))
//   result.direction==="from"?dispatch(TransferUserSuccess(left)):dispatch(TransferToUserSuccess(right))
//   result.direction==="from"?console.log("new left",left):console.log("new right",right)
//   begin.direction==="from"?console.log("old left",left):console.log("old right",right)
// };
const reorder = (oldList,newList, startIndex, endIndex) => {
  const begin=getList(oldList)
  console.log("begin",begin)
  const [removed] = begin.origin.splice(startIndex, 1);
  const updatedValueOld={}
  updatedValueOld[begin.type]=begin.origin
  begin.direction==="from"?setLeft(assets=>({...assets,...updatedValueOld})):setRight(assets=>({...assets,...updatedValueOld}))

  const result = getList(newList)
  console.log("result New",result)

  
  result.origin.splice(endIndex, 0, removed);
  
  // const newListKey=new String(newList[1][1])
  const updatedValueNew={}
  updatedValueNew[result.type]=result.origin  
  result.direction==="from"?setLeft(assets=>({...assets,...updatedValueNew})):setRight(assets=>({...assets,...updatedValueNew}))
  result.direction==="from"?dispatch(TransferUserSuccess(left)):dispatch(TransferToUserSuccess(right))
  result.direction==="from"?console.log("new left",left):console.log("new right",right)
  begin.direction==="from"?console.log("old left",left):console.log("old right",right)
};

const getList = (id) => {
  const listName=id.split("-")
  var list=[]
  listName[0]==="from"?list=left[listName[1]]:list=right[listName[1]]

    // #list=list we need to change inside left||right //listName=to||from &&fromDevices||VM||deviceProfiles
  return{origin:list,direction:listName[0],type:listName[1]}
};
// ##Main function for Dragging
function onDragEnd(result) {

  const { source, destination } = result;
  console.log("result",result);

  // dropped outside the list
  if (!destination) {
    return;
}
  
  
  // if (!result.destination) {
  //   return;
  // }
  const sourceIndex = source.index;
  const destIndex = destination.index;
  // ##MainDrag
  if (result.type === "droppableItem" ) {
      console.log("outer drag");

      // ##Reorder in the same cloumn
    if (source.droppableId === destination.droppableId) {

    reorder(source.droppableId,destination.droppableId, sourceIndex, destIndex);
        
    }
    // ##Reorder in the different cloumn
    if (source.droppableId !== destination.droppableId){
      reorder(source.droppableId,destination.droppableId, sourceIndex, destIndex);
   }
  } 
  else if (result.type === "droppableSubItem") {
    const itemSubItemMap = this.state.items.reduce((acc, item) => {
      acc[item.id] = item.subItems;
      return acc;
    }, {});

    const sourceParentId = parseInt(result.source.droppableId);
    const destParentId = parseInt(result.destination.droppableId);

    const sourceSubItems = itemSubItemMap[sourceParentId];
    const destSubItems = itemSubItemMap[destParentId];

    let newItems = [...this.state.items];

    /** In this case subItems are reOrdered inside same Parent */
    if (sourceParentId === destParentId) {
      const reorderedSubItems = reorder(
        sourceSubItems,
        sourceIndex,
        destIndex
      );
      newItems = newItems.map(item => {
        if (item.id === sourceParentId) {
          item.subItems = reorderedSubItems;
        }
        return item;
      });
      this.setState({
        items: newItems
      });
    } else {
      let newSourceSubItems = [...sourceSubItems];
      const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

      let newDestSubItems = [...destSubItems];
      newDestSubItems.splice(destIndex, 0, draggedItem);
      newItems = newItems.map(item => {
        if (item.id === sourceParentId) {
          item.subItems = newSourceSubItems;
        } else if (item.id === destParentId) {
          item.subItems = newDestSubItems;
        }
        return item;
      });
      this.setState({
        items: newItems
      });
    }
  }
}
const onDragUpdate=(res)=>{
  console.log("onDragUpdate",res)
}
// sx={{width:"100%",marginBottom:1, height:50+110*longest(left,right,"phoneDevices")}
  return (<>
   <Grid container >
   {(left.phoneDevices||right.phoneDevices) &&<Paper  sx={{width:"60%", position: "relative",left: "15%",marginBottom:1, height:50+110*longest(left,right,"phoneDevices")}}
>
      <Typography variant='h6' sx={{fontWeight:"bold",color:"gray",m:"8px 0 0 8px"}}>Phone Devices</Typography>
      <DragDropContext onDragStart={onDragStart}  onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
    <div className="AssetCont">
    <Droppable droppableId="from-phoneDevices" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      // {...provided.placeholder}
      // {...provided}
      style={getListStyle(snapshot.isDraggingOver,provided)}>
        
        {left.phoneDevices?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid}
                                    draggableId={info.device}
                                    index={index}>
                                    {(provided, snapshot) => (
            <div className="DeviceCont" ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
             style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}
          
          >
            <Typography key={index}>{info.device}</Typography>
            <Grid item ><CustomList items={info.extensions}/></Grid></div>
              )}
              </Draggable>
            </>
          )
        })}
      
      </div>
    )}
    
      </Droppable>
      <Droppable droppableId="to-phoneDevices" type="droppableItem">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}>
        
        {right.phoneDevices?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.uuid}
                                    draggableId={info.uuid}
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
            <Grid item ><CustomList items={info.extensions}/></Grid></div>
              )}
              </Draggable>
            </>
          )
        })}
      
      </div>
    )}
    
      </Droppable>
      </div>
      </DragDropContext>
      </Paper>}
      {(left.VM||right.VM) &&<Paper sx={{width:"60%", position: "relative",left: "15%",marginBottom:1, height:50+110*longest(left,right,"VM")}}>
      <Typography variant='h6' sx={{fontWeight:"bold",color:"gray",m:"8px 0 0 8px"}}>User VoiceMail</Typography>
      <DragDropContext>
    <div className="AssetCont">
    <Droppable droppableId="from-VM">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}>
        
        {left.VM?.map((info,index)=>{
          return(
            <>
          <Draggable
          key={info.objectId}
          draggableId={info.objectId}
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
            <Grid item><CustomList items={info.extensions}/></Grid></div>
              )}
              </Draggable>
            </>
          )
        })}
      
      </div>
    )}
    
      </Droppable>
      <Droppable droppableId="to-VM">
    {(provided, snapshot) => (
      <div className="DeviceCon"  ref={provided.innerRef}
      style={getListStyle(snapshot.isDraggingOver)}>
        
        {right.VM?.map((info,index)=>{
          return(
            <>
             <Draggable
                                    key={info.objectId}
                                    draggableId={info.objectId}
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
            <Grid item ><CustomList items={info.extensions}/></Grid></div>
              )}
              </Draggable>
            </>
          )
        })}
      
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
