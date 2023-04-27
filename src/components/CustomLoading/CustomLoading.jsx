import { CircularProgress, createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/styles';
import React from 'react'
import "./CustomLoading.css"

export default function CustomLoading() {
  
  return (
    <div className="LoadingScreen">
        
        
    <div className="LoadingCircular">
      <div className="loadingSVG">
        
     <CircularProgress size={50}  thickness={5}  sx={{  top: "10%",right: "50%",left: "50%",color:"#36d11d"}} /></div>
     <h4 className="LoadingText" color='floralwhite'>processing...</h4></div>
     </div>
  )
}
