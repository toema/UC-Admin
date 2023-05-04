import React, { useEffect, useState } from 'react'
import "./Tickets.css"
import axios from 'axios'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Tickets() {
  let navigate = useNavigate();

  const [Tickets, setTickets] =
  useState(
      {"data":[]}
  );
  const Checktickets= async()=>{
    console.log("request for tickets actions")
    await axios.get("/Tickets").then(res=>{
      console.log(res.data)
      res.data !== null?setTickets(res):setTickets({"data":{"data":"no data to be displayed"}})
      
      
    })

  }
  // const newRows=()=>{Tickets.map((obj,k)=>{
  //     for (var key in obj){
  //       if (key==="_id"){
  //       obj[key]=obj["col1"]
  //       delete obj[key]
  //       }
  //     }
  //     console.log(obj)
  // return obj
  //   })}
//   var row= []
//   const newRows=()=>{Tickets.data.map((obj,k)=>{
//     obj=
//     { id: k+1, col1: obj.type, col2: obj.action,col3:obj.date,col4:obj["_id"] }
// return row.push(obj)
//   })}

  useEffect(() => {
    Checktickets();
    // newRows()
    
  },[]);
  // useEffect(()=>{
  //   newRows()
  //   console.log(row)
  // },[Tickets])
  const nav=row=>{navigate(`/Tickets/${String(row.id)}`)}

  return (
    <div className='right-main'>
      <div className="top">
            <h1>Tickets</h1>
          </div>
          <div className="mapping">
          <div style={{ height: 300, width: '100%' }}>
      <DataGrid  onRowClick={(row)=>{nav(row)}} getRowId={(row) => row["_id"]} sx={{boxShadow: 2,
    border: 2,}}rows={Tickets.data} columns={columns} />
    </div>
    </div>
        {/* <div className="mapping">
        {Tickets.data?.map((obj,i)=>{
          return(<div key={obj["_id"]}>
          <div  className="key9">
          <div className="type">{obj.type}</div>
          <div className="action">{obj.action}</div>
          <div className="date">{obj.date}</div>
          <div className="div">{obj["_id"]}</div>
          </div>
          </div>)
        })}
          
        </div> */}
    </div>
  )
}

// const rows =[
//   { id: 1, type: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];


const columns = [
  { field: 'type', headerName: 'Type', minWidth: 100 },
  { field: 'action', headerName: 'Action', minWidth: 200 },
  { field: 'date', headerName: 'Date', minWidth: 200 },
  { field: '_id', headerName: 'Reference', minWidth: 400 },
];