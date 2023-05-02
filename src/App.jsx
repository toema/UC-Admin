import React,{useState} from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css"
import Home from "./Pages/Home/Home";
import AddUsers from "./Pages/AddUsers/AddUsers";
import { Provider } from "react-redux";
import {store} from './Redux/store';
import Les from "./Pages/api/api";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CheckTrans from "./components/testComp/CheckTrans";
import {SnackbarProvider,useSnackbar} from "notistack"
import TransferUsers from "./Pages/TransferUsers/TransferUsers";


function App() {
  // const {  closeSnackbar } = useSnackbar();

  const [SendData,SetSendData]=useState('')
  return( 
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}  
    // ref={"name"}
  // action={(snackbarId) => (
  //   <button onClick={() => closeSnackbar(snackbarId)}>
  //     Dismiss
  //   </button>)}
    >
  <div className="totalApp">
    
    
    <Router>

<div className="container">
<Sidebar/>
<div className="left_main">
<Topbar/>
  <Routes path="/">
<Route index element={<Home/>}/>
  <Route path="Users">
    <Route index/>
    <Route path=":UserId" element={<Les/>}/>
    </Route>
    <Route path="/test" element={<CheckTrans/>}/>
<Route path="/api" element={<Les SendData={SendData} />}/>
<Route  path="/AddUsers" element={<AddUsers SetSendData={SetSendData}/>}/>
<Route  path="/TransferUsers" element={<TransferUsers />}/>
  </Routes>
</div>

  
</div>
</Router>
</div>
</SnackbarProvider>
</Provider>
  );
}

export default App;
