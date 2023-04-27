import React from 'react'
import { connect, useSelector } from 'react-redux'
import "./CheckTrans.css"

 const CheckTrans=(props)=> {
    // const Users=useSelector(state=>{return state.users})
  
    console.log(props)
  return (<div className='CheckTrans'><h1>{props.users}</h1></div>
  )}

  const mapStateToProps=(state)=>{return (state)}
  export default connect(mapStateToProps)(CheckTrans)