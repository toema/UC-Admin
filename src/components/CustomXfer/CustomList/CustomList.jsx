import { DragIndicator } from '@mui/icons-material';
import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import React, { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd';

export default function CustomList (props){

const {info,index,items,parent}=props
const grid = 5;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid ,
  margin: `0 2px 2px 0`,

  // display: "inline-flex",
  // width: "120px",
  // padding: "10px",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "none",
  // display: "inline-flex",
  // padding: "10px",
  // margin: "0 10px 10px 0",
  // border: "1px solid grey",
  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "none",
  padding: "10px",
  margin: "2px 0"
});
// console.log("parent",parent)
return(
  <Droppable droppableId={parent+"-"+index+"-extensions"} type={`droppableSubItem`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
  <Paper className="MainList" sx={{ width: 200, padding:"10px 0px",height: 60+items.lenght*60, overflow: 'auto' }}>
    
    <List dense className="listTest" component="div" role="list">
      {items?.map((value,index) => {
        const labelId = `transfer-list-item-${value.uuid}-label`;
        return (  
          <Draggable  key={value.uuid} draggableId={value.name} index={index}>
          {(provided, snapshot) => (
        <div className="listCont"   ref={provided.innerRef}
        {...provided.draggableProps}
        style={getItemStyle(
          snapshot.isDragging,
          provided.draggableProps.style
        )}
        key={value.uuid}>
          <ListItem
          // sx={{padding:"0px 16px"}}
            role="listitem"
          >
            <ListItemIcon>
              <div {...provided.dragHandleProps} className="iconCont">
              <DragIndicator
               
              /></div>
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value.name} - ${value.partition?value.partition:"None"}`} />
          </ListItem>
          {provided.placeholder}
                    </div>
        )}
        </Draggable>);
      })}
      
    </List>
  </Paper> {provided.placeholder}</div>
    )}
    
      </Droppable>
)}